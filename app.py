import os
import json
import uuid
import hashlib
import cloudinary
import cloudinary.uploader
from flask import Flask, request, jsonify, send_from_directory, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from functools import wraps
from datetime import datetime, timedelta

app = Flask(__name__, static_folder='.', static_url_path='')
app.secret_key = os.environ.get('SECRET_KEY', 'opay-super-secret-key-change-in-prod')
app.permanent_session_lifetime = timedelta(days=30)

CORS(app, supports_credentials=True, origins=['*'])

# ── PostgreSQL via SQLAlchemy ──────────────────────────────────────────────────
DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:///opay_local.db')
# Render/Heroku use postgres:// but SQLAlchemy needs postgresql://
if DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# ── Cloudinary config ──────────────────────────────────────────────────────────
cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key=os.environ.get('CLOUDINARY_API_KEY'),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET'),
    secure=True
)

# ── Seeded Admin Credentials ───────────────────────────────────────────────────
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'clinton')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', '147852')
ADMIN_PIN = os.environ.get('ADMIN_PIN', '0803')

# ── Database Models ────────────────────────────────────────────────────────────
def hash_password(pw):
    return hashlib.sha256(pw.encode()).hexdigest()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(64), nullable=False)
    pin_hash = db.Column(db.String(64), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    full_name = db.Column(db.String(120), nullable=True)
    account_number = db.Column(db.String(20), nullable=True)
    balance = db.Column(db.Float, default=0.0)
    safebox_balance = db.Column(db.Float, default=0.0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime, nullable=True)
    notes = db.Column(db.Text, nullable=True)  # admin can write notes on users
    customization = db.Column(db.Text, default='{}')  # JSON string

    def to_dict(self, include_sensitive=False):
        d = {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'phone': self.phone,
            'full_name': self.full_name,
            'account_number': self.account_number,
            'balance': self.balance,
            'safebox_balance': self.safebox_balance,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None,
        }
        if include_sensitive:
            d['notes'] = self.notes
        return d

class AppState(db.Model):
    """Stores global admin app state (balance, customization)."""
    __tablename__ = 'app_state'
    id = db.Column(db.Integer, primary_key=True, default=1)
    balance = db.Column(db.Float, default=float(os.environ.get('INITIAL_BALANCE', '80754')))
    safebox_balance = db.Column(db.Float, default=15000.0)
    customization = db.Column(db.Text, default=json.dumps({
        'primaryColor': '#00B875',
        'secondaryColor': '#1C1D37',
        'profilePhoto': '',
        'profilePhotoSize': 1,
        'buttonImages': {},
        'buttonBackgroundColor': '#F5F5F7',
        'networkImages': {},
    }))

def get_admin_state():
    state = db.session.get(AppState, 1)
    if not state:
        state = AppState(id=1)
        db.session.add(state)
        db.session.commit()
    return state

def get_admin_customization():
    state = get_admin_state()
    try:
        return json.loads(state.customization)
    except Exception:
        return {}

def save_admin_customization(data):
    state = get_admin_state()
    try:
        current = json.loads(state.customization)
    except Exception:
        current = {}
    current.update(data)
    state.customization = json.dumps(current)
    db.session.commit()

# ── Auth helpers ───────────────────────────────────────────────────────────────
def require_admin(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not session.get('is_admin'):
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated

def require_auth(f):
    """Requires any logged-in user (admin or normal user)."""
    @wraps(f)
    def decorated(*args, **kwargs):
        if not session.get('is_admin') and not session.get('user_id'):
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated

# ── Auth routes ────────────────────────────────────────────────────────────────
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    method = data.get('method', 'password')

    if method == 'password':
        pw = data.get('password', '')
        # Check if it's the master admin password
        if pw == ADMIN_PASSWORD:
            session.permanent = True
            session['is_admin'] = True
            session['user'] = ADMIN_USERNAME
            session.pop('user_id', None)
            return jsonify({'ok': True, 'is_admin': True, 'username': ADMIN_USERNAME})
        # Otherwise check normal users
        user = User.query.filter_by(email=data.get('email', ''), is_active=True).first()
        if user and user.password_hash == hash_password(pw):
            user.last_login = datetime.utcnow()
            db.session.commit()
            session.permanent = True
            session['user_id'] = user.id
            session['user'] = user.username
            session.pop('is_admin', None)
            return jsonify({'ok': True, 'is_admin': False, 'username': user.username, 'user_id': user.id})
        return jsonify({'ok': False, 'error': 'Invalid credentials'}), 401

    elif method == 'pin':
        pin = data.get('pin', '')
        if pin == ADMIN_PIN:
            session.permanent = True
            session['is_admin'] = True
            session['user'] = ADMIN_USERNAME
            session.pop('user_id', None)
            return jsonify({'ok': True, 'is_admin': True, 'username': ADMIN_USERNAME})
        # Check normal users by pin
        user = User.query.filter_by(is_active=True).all()
        for u in user:
            if u.pin_hash and u.pin_hash == hash_password(pin) and u.username == data.get('username', ''):
                u.last_login = datetime.utcnow()
                db.session.commit()
                session.permanent = True
                session['user_id'] = u.id
                session['user'] = u.username
                session.pop('is_admin', None)
                return jsonify({'ok': True, 'is_admin': False, 'username': u.username, 'user_id': u.id})
        return jsonify({'ok': False, 'error': 'Invalid PIN'}), 401

    elif method == 'fingerprint':
        session.permanent = True
        session['is_admin'] = True
        session['user'] = ADMIN_USERNAME
        session.pop('user_id', None)
        return jsonify({'ok': True, 'is_admin': True, 'username': ADMIN_USERNAME})

    return jsonify({'ok': False, 'error': 'Invalid method'}), 400

@app.route('/api/register', methods=['POST'])
def register():
    """Normal users can register themselves."""
    data = request.get_json() or {}
    username = (data.get('username') or '').strip()
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    full_name = (data.get('full_name') or '').strip()
    phone = (data.get('phone') or '').strip()

    if not username or not email or not password:
        return jsonify({'ok': False, 'error': 'Username, email, and password are required'}), 400
    if len(password) < 6:
        return jsonify({'ok': False, 'error': 'Password must be at least 6 characters'}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({'ok': False, 'error': 'Username already taken'}), 409
    if User.query.filter_by(email=email).first():
        return jsonify({'ok': False, 'error': 'Email already registered'}), 409

    # Generate a random 10-digit account number
    import random
    account_number = '0' + ''.join([str(random.randint(0, 9)) for _ in range(9)])

    user = User(
        username=username,
        email=email,
        password_hash=hash_password(password),
        full_name=full_name,
        phone=phone,
        account_number=account_number,
        balance=0.0,
        safebox_balance=0.0,
    )
    db.session.add(user)
    db.session.commit()

    session.permanent = True
    session['user_id'] = user.id
    session['user'] = user.username
    session.pop('is_admin', None)

    return jsonify({
        'ok': True,
        'user': user.to_dict(),
        'message': 'Account created successfully'
    })

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'ok': True})

@app.route('/api/session', methods=['GET'])
def check_session():
    if session.get('is_admin'):
        state = get_admin_state()
        return jsonify({
            'is_admin': True,
            'user': ADMIN_USERNAME,
            'balance': state.balance,
            'safebox_balance': state.safebox_balance,
        })
    elif session.get('user_id'):
        user = db.session.get(User, session['user_id'])
        if user and user.is_active:
            return jsonify({
                'is_admin': False,
                'user': user.username,
                'user_id': user.id,
                'full_name': user.full_name,
                'account_number': user.account_number,
                'balance': user.balance,
                'safebox_balance': user.safebox_balance,
                'customization': json.loads(user.customization or '{}'),
            })
    return jsonify({'is_admin': False, 'user': ''})

# ── Balance routes ─────────────────────────────────────────────────────────────
@app.route('/api/balance', methods=['GET'])
@require_auth
def get_balance():
    if session.get('is_admin'):
        return jsonify({'balance': get_admin_state().balance})
    user = db.session.get(User, session['user_id'])
    return jsonify({'balance': user.balance if user else 0})

@app.route('/api/balance/adjust', methods=['POST'])
@require_admin
def adjust_balance():
    data = request.get_json() or {}
    operation = data.get('operation', 'add')
    amount = float(data.get('amount', 0))
    target_user_id = data.get('user_id')  # if admin adjusting a user's balance

    if amount <= 0:
        return jsonify({'error': 'Amount must be positive'}), 400

    if target_user_id:
        user = db.session.get(User, target_user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        if operation == 'add':
            user.balance += amount
        elif operation == 'subtract':
            user.balance = max(0, user.balance - amount)
        db.session.commit()
        return jsonify({'ok': True, 'balance': user.balance, 'user_id': user.id})
    else:
        state = get_admin_state()
        if operation == 'add':
            state.balance += amount
        elif operation == 'subtract':
            state.balance = max(0, state.balance - amount)
        db.session.commit()
        return jsonify({'ok': True, 'balance': state.balance})

@app.route('/api/balance/set', methods=['POST'])
@require_admin
def set_balance():
    data = request.get_json() or {}
    amount = float(data.get('amount', 0))
    target_user_id = data.get('user_id')

    if target_user_id:
        user = db.session.get(User, target_user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        user.balance = max(0, amount)
        db.session.commit()
        return jsonify({'ok': True, 'balance': user.balance, 'user_id': user.id})
    else:
        state = get_admin_state()
        state.balance = max(0, amount)
        db.session.commit()
        return jsonify({'ok': True, 'balance': state.balance})

# ── Admin: User Management ─────────────────────────────────────────────────────
@app.route('/api/admin/users', methods=['GET'])
@require_admin
def list_users():
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify({'users': [u.to_dict(include_sensitive=True) for u in users]})

@app.route('/api/admin/users', methods=['POST'])
@require_admin
def create_user():
    """Admin creates a user account directly."""
    data = request.get_json() or {}
    username = (data.get('username') or '').strip()
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    full_name = (data.get('full_name') or '').strip()
    phone = (data.get('phone') or '').strip()
    balance = float(data.get('balance', 0))
    notes = data.get('notes', '')

    if not username or not email or not password:
        return jsonify({'ok': False, 'error': 'Username, email, and password are required'}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({'ok': False, 'error': 'Username already taken'}), 409
    if User.query.filter_by(email=email).first():
        return jsonify({'ok': False, 'error': 'Email already registered'}), 409

    import random
    account_number = '0' + ''.join([str(random.randint(0, 9)) for _ in range(9)])

    user = User(
        username=username,
        email=email,
        password_hash=hash_password(password),
        full_name=full_name,
        phone=phone,
        account_number=account_number,
        balance=balance,
        notes=notes,
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({'ok': True, 'user': user.to_dict(include_sensitive=True)})

@app.route('/api/admin/users/<user_id>', methods=['GET'])
@require_admin
def get_user(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'error': 'Not found'}), 404
    return jsonify({'user': user.to_dict(include_sensitive=True)})

@app.route('/api/admin/users/<user_id>', methods=['PATCH'])
@require_admin
def update_user(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'error': 'Not found'}), 404
    data = request.get_json() or {}
    if 'full_name' in data:
        user.full_name = data['full_name']
    if 'phone' in data:
        user.phone = data['phone']
    if 'email' in data:
        user.email = data['email'].lower()
    if 'balance' in data:
        user.balance = float(data['balance'])
    if 'safebox_balance' in data:
        user.safebox_balance = float(data['safebox_balance'])
    if 'is_active' in data:
        user.is_active = bool(data['is_active'])
    if 'notes' in data:
        user.notes = data['notes']
    if 'password' in data and data['password']:
        user.password_hash = hash_password(data['password'])
    db.session.commit()
    return jsonify({'ok': True, 'user': user.to_dict(include_sensitive=True)})

@app.route('/api/admin/users/<user_id>', methods=['DELETE'])
@require_admin
def delete_user(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'error': 'Not found'}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({'ok': True})

# ── Customization routes ───────────────────────────────────────────────────────
@app.route('/api/customization', methods=['GET'])
def get_customization():
    if session.get('is_admin'):
        return jsonify(get_admin_customization())
    elif session.get('user_id'):
        user = db.session.get(User, session['user_id'])
        if user:
            try:
                return jsonify(json.loads(user.customization or '{}'))
            except Exception:
                return jsonify({})
    # Public default
    return jsonify(get_admin_customization())

@app.route('/api/customization', methods=['POST'])
@require_admin
def set_customization():
    data = request.get_json() or {}
    allowed = ['primaryColor', 'secondaryColor', 'profilePhotoSize', 'buttonBackgroundColor']
    current = get_admin_customization()
    for key in allowed:
        if key in data:
            current[key] = data[key]
    state = get_admin_state()
    state.customization = json.dumps(current)
    db.session.commit()
    return jsonify({'ok': True, 'customization': current})

# ── Image upload routes ────────────────────────────────────────────────────────
@app.route('/api/upload/image', methods=['POST'])
@require_admin
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    file = request.files['file']
    image_key = request.form.get('key', 'general')
    try:
        result = cloudinary.uploader.upload(
            file,
            folder='opay/buttons',
            public_id=f'opay_btn_{image_key}',
            overwrite=True,
            transformation=[{'width': 512, 'height': 512, 'crop': 'limit', 'quality': 'auto', 'fetch_format': 'auto'}]
        )
        url = result['secure_url']
        current = get_admin_customization()
        current.setdefault('buttonImages', {})[image_key] = url
        state = get_admin_state()
        state.customization = json.dumps(current)
        db.session.commit()
        return jsonify({'ok': True, 'url': url, 'key': image_key})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/upload/profile', methods=['POST'])
@require_auth
def upload_profile():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    file = request.files['file']
    username = session.get('user', 'user')
    try:
        result = cloudinary.uploader.upload(
            file,
            folder='opay/profiles',
            public_id=f'opay_profile_{username}',
            overwrite=True,
            transformation=[{'width': 400, 'height': 400, 'crop': 'fill', 'gravity': 'face', 'quality': 'auto', 'fetch_format': 'auto'}]
        )
        url = result['secure_url']
        if session.get('is_admin'):
            current = get_admin_customization()
            current['profilePhoto'] = url
            state = get_admin_state()
            state.customization = json.dumps(current)
            db.session.commit()
        else:
            user = db.session.get(User, session['user_id'])
            if user:
                try:
                    cust = json.loads(user.customization or '{}')
                except Exception:
                    cust = {}
                cust['profilePhoto'] = url
                user.customization = json.dumps(cust)
                db.session.commit()
        return jsonify({'ok': True, 'url': url})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/upload/network', methods=['POST'])
@require_admin
def upload_network_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    file = request.files['file']
    network_key = request.form.get('key', 'network')
    try:
        result = cloudinary.uploader.upload(
            file,
            folder='opay/networks',
            public_id=f'opay_net_{network_key}',
            overwrite=True,
            transformation=[{'width': 200, 'height': 200, 'crop': 'limit', 'quality': 'auto', 'fetch_format': 'auto'}]
        )
        url = result['secure_url']
        current = get_admin_customization()
        current.setdefault('networkImages', {})[network_key] = url
        state = get_admin_state()
        state.customization = json.dumps(current)
        db.session.commit()
        return jsonify({'ok': True, 'url': url, 'key': network_key})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/image/reset', methods=['POST'])
@require_admin
def reset_image():
    data = request.get_json() or {}
    key = data.get('key')
    image_type = data.get('type', 'button')
    current = get_admin_customization()
    if image_type == 'profile':
        current['profilePhoto'] = ''
    elif image_type == 'network' and key:
        current.setdefault('networkImages', {}).pop(key, None)
    elif image_type == 'button' and key:
        current.setdefault('buttonImages', {}).pop(key, None)
    elif image_type == 'all-buttons':
        current['buttonImages'] = {}
    elif image_type == 'all-networks':
        current['networkImages'] = {}
    state = get_admin_state()
    state.customization = json.dumps(current)
    db.session.commit()
    return jsonify({'ok': True})

# ── State endpoint ─────────────────────────────────────────────────────────────
@app.route('/api/state', methods=['GET'])
def get_state():
    if session.get('is_admin'):
        state = get_admin_state()
        return jsonify({
            'balance': state.balance,
            'safebox_balance': state.safebox_balance,
            'customization': get_admin_customization(),
            'is_admin': True,
            'user': ADMIN_USERNAME,
        })
    elif session.get('user_id'):
        user = db.session.get(User, session['user_id'])
        if user and user.is_active:
            try:
                cust = json.loads(user.customization or '{}')
            except Exception:
                cust = {}
            # Merge admin customization (for shared branding) with user's own overrides
            admin_cust = get_admin_customization()
            merged = {**admin_cust, **cust}
            return jsonify({
                'balance': user.balance,
                'safebox_balance': user.safebox_balance,
                'customization': merged,
                'is_admin': False,
                'user': user.username,
                'user_id': user.id,
                'full_name': user.full_name,
                'account_number': user.account_number,
            })
    return jsonify({
        'balance': 0,
        'safebox_balance': 0,
        'customization': get_admin_customization(),
        'is_admin': False,
        'user': '',
    })

# ── User self-service: update own profile ─────────────────────────────────────
@app.route('/api/user/profile', methods=['PATCH'])
@require_auth
def update_own_profile():
    if session.get('is_admin'):
        return jsonify({'error': 'Admin uses /api/customization'}), 400
    user = db.session.get(User, session['user_id'])
    if not user:
        return jsonify({'error': 'Not found'}), 404
    data = request.get_json() or {}
    if 'full_name' in data:
        user.full_name = data['full_name']
    if 'phone' in data:
        user.phone = data['phone']
    if 'pin' in data and data['pin']:
        user.pin_hash = hash_password(str(data['pin']))
    if 'password' in data and data['password']:
        if not data.get('current_password'):
            return jsonify({'error': 'Current password required'}), 400
        if user.password_hash != hash_password(data['current_password']):
            return jsonify({'error': 'Current password incorrect'}), 401
        user.password_hash = hash_password(data['password'])
    db.session.commit()
    return jsonify({'ok': True, 'user': user.to_dict()})

# ── PWA: serve index.html for all non-API routes ──────────────────────────────
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path.startswith('api/'):
        return jsonify({'error': 'Not found'}), 404
    full_path = os.path.join(app.static_folder, path)
    if path and os.path.exists(full_path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

# ── DB init ────────────────────────────────────────────────────────────────────
with app.app_context():
    db.create_all()
    # Ensure admin app state row exists
    if not db.session.get(AppState, 1):
        db.session.add(AppState(id=1))
        db.session.commit()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
