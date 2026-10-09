import os
import json
import cloudinary
import cloudinary.uploader
from flask import Flask, request, jsonify, send_from_directory, session
from flask_cors import CORS
from functools import wraps
from datetime import timedelta

app = Flask(__name__, static_folder='.', static_url_path='')
app.secret_key = os.environ.get('SECRET_KEY', 'opay-super-secret-key-change-in-prod')
app.permanent_session_lifetime = timedelta(days=30)

CORS(app, supports_credentials=True, origins=['*'])

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

# ── In-memory state (persists per dyno; use Redis/DB for production) ──────────
# For Render free tier single dyno this is fine
_state = {
    'balance': float(os.environ.get('INITIAL_BALANCE', '80754')),
    'safebox_balance': 15000.0,
    'customization': {
        'primaryColor': '#00B875',
        'secondaryColor': '#1C1D37',
        'profilePhoto': '',
        'profilePhotoSize': 1,
        'buttonImages': {},
        'buttonBackgroundColor': '#F5F5F7',
        'networkImages': {},
    }
}

# Try to load persisted state from env-backed JSON (for across restarts)
_state_file = '/tmp/opay_state.json'
def _load_state():
    try:
        if os.path.exists(_state_file):
            with open(_state_file) as f:
                saved = json.load(f)
                _state.update(saved)
    except Exception:
        pass

def _save_state():
    try:
        with open(_state_file, 'w') as f:
            json.dump(_state, f)
    except Exception:
        pass

_load_state()

# ── Auth helpers ───────────────────────────────────────────────────────────────
def require_admin(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not session.get('is_admin'):
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated

# ── Auth routes ────────────────────────────────────────────────────────────────
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    method = data.get('method', 'password')

    if method == 'password':
        if data.get('password') == ADMIN_PASSWORD:
            session.permanent = True
            session['is_admin'] = True
            session['user'] = ADMIN_USERNAME
            return jsonify({'ok': True, 'is_admin': True})
        return jsonify({'ok': False, 'error': 'Invalid password'}), 401

    elif method == 'pin':
        if data.get('pin') == ADMIN_PIN:
            session.permanent = True
            session['is_admin'] = True
            session['user'] = ADMIN_USERNAME
            return jsonify({'ok': True, 'is_admin': True})
        return jsonify({'ok': False, 'error': 'Invalid PIN'}), 401

    elif method == 'fingerprint':
        # Fingerprint is client-side biometric; we just create the session
        session.permanent = True
        session['is_admin'] = True
        session['user'] = ADMIN_USERNAME
        return jsonify({'ok': True, 'is_admin': True})

    return jsonify({'ok': False, 'error': 'Invalid method'}), 400

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'ok': True})

@app.route('/api/session', methods=['GET'])
def check_session():
    return jsonify({
        'is_admin': bool(session.get('is_admin')),
        'user': session.get('user', '')
    })

# ── Balance routes (admin only) ────────────────────────────────────────────────
@app.route('/api/balance', methods=['GET'])
def get_balance():
    return jsonify({'balance': _state['balance']})

@app.route('/api/balance/adjust', methods=['POST'])
@require_admin
def adjust_balance():
    data = request.get_json() or {}
    operation = data.get('operation', 'add')
    amount = float(data.get('amount', 0))
    if amount <= 0:
        return jsonify({'error': 'Amount must be positive'}), 400
    if operation == 'add':
        _state['balance'] += amount
    elif operation == 'subtract':
        _state['balance'] = max(0, _state['balance'] - amount)
    else:
        return jsonify({'error': 'Invalid operation'}), 400
    _save_state()
    return jsonify({'ok': True, 'balance': _state['balance']})

@app.route('/api/balance/set', methods=['POST'])
@require_admin
def set_balance():
    data = request.get_json() or {}
    amount = float(data.get('amount', 0))
    _state['balance'] = max(0, amount)
    _save_state()
    return jsonify({'ok': True, 'balance': _state['balance']})

# ── Customization / state routes ───────────────────────────────────────────────
@app.route('/api/customization', methods=['GET'])
def get_customization():
    return jsonify(_state['customization'])

@app.route('/api/customization', methods=['POST'])
@require_admin
def set_customization():
    data = request.get_json() or {}
    allowed = ['primaryColor', 'secondaryColor', 'profilePhotoSize', 'buttonBackgroundColor']
    for key in allowed:
        if key in data:
            _state['customization'][key] = data[key]
    _save_state()
    return jsonify({'ok': True, 'customization': _state['customization']})

# ── Cloudinary image upload (admin-only for button images, open for profile) ──
@app.route('/api/upload/image', methods=['POST'])
@require_admin
def upload_image():
    """Upload any button/icon image — admin only."""
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

        if image_key == 'app-logo':
            _state['customization']['buttonImages']['app-logo'] = url
        else:
            _state['customization']['buttonImages'][image_key] = url

        _save_state()
        return jsonify({'ok': True, 'url': url, 'key': image_key})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/upload/profile', methods=['POST'])
def upload_profile():
    """Upload profile photo — open to any authenticated session (all users)."""
    if not session.get('is_admin'):
        return jsonify({'error': 'Please log in first'}), 401

    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    file = request.files['file']

    try:
        result = cloudinary.uploader.upload(
            file,
            folder='opay/profiles',
            public_id=f'opay_profile_{session.get("user", "user")}',
            overwrite=True,
            transformation=[{'width': 400, 'height': 400, 'crop': 'fill', 'gravity': 'face', 'quality': 'auto', 'fetch_format': 'auto'}]
        )
        url = result['secure_url']
        _state['customization']['profilePhoto'] = url
        _save_state()
        return jsonify({'ok': True, 'url': url})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/upload/network', methods=['POST'])
@require_admin
def upload_network_image():
    """Upload a network icon (MTN, Airtel, etc.) — admin only."""
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
        _state['customization']['networkImages'][network_key] = url
        _save_state()
        return jsonify({'ok': True, 'url': url, 'key': network_key})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/image/reset', methods=['POST'])
@require_admin
def reset_image():
    data = request.get_json() or {}
    key = data.get('key')
    image_type = data.get('type', 'button')  # 'button', 'network', 'profile'

    if image_type == 'profile':
        _state['customization']['profilePhoto'] = ''
    elif image_type == 'network' and key:
        _state['customization']['networkImages'].pop(key, None)
    elif image_type == 'button' and key:
        _state['customization']['buttonImages'].pop(key, None)
    elif image_type == 'all-buttons':
        _state['customization']['buttonImages'] = {}
    elif image_type == 'all-networks':
        _state['customization']['networkImages'] = {}

    _save_state()
    return jsonify({'ok': True})

# ── State sync endpoint (frontend polls this) ──────────────────────────────────
@app.route('/api/state', methods=['GET'])
def get_state():
    return jsonify({
        'balance': _state['balance'],
        'customization': _state['customization'],
        'is_admin': bool(session.get('is_admin'))
    })

# ── PWA: Serve the SPA for all non-API routes ─────────────────────────────────
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path.startswith('api/'):
        return jsonify({'error': 'Not found'}), 404
    full_path = os.path.join(app.static_folder, path)
    if path and os.path.exists(full_path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
