function renderCardsPage(container) {
  const { primaryColor } = Stores.customization.get();
  let activeTab = 'virtual'; // 'virtual' | 'physical'
  let activeCard = 0;

  // Card definitions - images uploadable by admin via customization
  const virtualCards = [
    {
      id: 'classic_virtual',
      name: 'OPay Verve Classic',
      type: 'Virtual Card',
      features: [
        { icon: 'zap', title: 'Instant Access', desc: 'Use it instantly after <span style="color:VAR_PC;">quick application</span>' },
        { icon: 'globe', title: 'Accepted at 40K+ Online Merchants', desc: 'Including <span style="color:VAR_PC;">GooglePlay, Netflix, Glovo, Shein, Jumia, Konga</span>, and more' },
        { icon: 'shopping-bag', title: 'Up to 15% Cashback', desc: '<span style="color:VAR_PC;">Earn cashback</span> on card transactions at GooglePlay, Glovo, Chowdeck &amp; BuyPower till Nov 30, 2026' },
        { icon: 'palette', title: 'NO maintenance fee', desc: 'Free &amp; switch your <span style="color:VAR_PC;">favorite card design</span> anytime' },
        { icon: 'shield-check', title: 'Safe &amp; Secure', desc: '<span style="color:VAR_PC;">CBN</span> licensed, <span style="color:VAR_PC;">NDIC</span> Insured' },
      ],
      price: 800, origPrice: 1000,
      bgKey: 'cardImg_classic_virtual',
      defaultBg: 'linear-gradient(135deg,#00B875,#007a50)',
      defaultContent: (pc) => `
        <div style="position:relative;height:100%;display:flex;flex-direction:column;justify-content:space-between;padding:1.25rem;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            <span style="color:white;font-size:1.375rem;font-weight:900;letter-spacing:-0.02em;">OPay</span>
          </div>
          <svg style="position:absolute;right:0;top:0;bottom:0;opacity:0.25;" width="220" height="160" viewBox="0 0 220 160">
            <circle cx="180" cy="80" r="120" fill="none" stroke="white" stroke-width="40"/>
          </svg>
          <div style="display:flex;justify-content:space-between;align-items:flex-end;">
            <span style="color:white;font-size:0.875rem;font-weight:600;">Virtual Card</span>
            <span style="background:white;border-radius:4px;padding:2px 8px;font-weight:900;font-style:italic;color:#ee2b3c;font-size:0.9375rem;">Verve</span>
          </div>
        </div>`,
    },
    {
      id: 'youth_virtual',
      name: 'OPay Verve Youth',
      type: 'Virtual Card',
      features: [
        { icon: 'zap', title: 'Crafted for your vivid life', desc: '<span style="color:VAR_PC;">Instant</span> Access, <span style="color:VAR_PC;">quick</span> application' },
        { icon: 'globe', title: 'Accepted at 40K+ Online Merchants', desc: 'Including <span style="color:VAR_PC;">GooglePlay, Netflix, Glovo, Shein, Jumia, Konga</span>, and more' },
        { icon: 'shopping-bag', title: 'Self-managed Transactions', desc: '<span style="color:VAR_PC;">Unique</span> Merchant Control, Unlimited Convenience' },
        { icon: 'palette', title: 'NO maintenance fee', desc: 'Free &amp; switch your <span style="color:VAR_PC;">favorite card design</span> anytime' },
        { icon: 'shield-check', title: 'Safe &amp; Secure', desc: '<span style="color:VAR_PC;">CBN</span> licensed, <span style="color:VAR_PC;">NDIC</span> Insured' },
      ],
      price: 800, origPrice: 1000,
      bgKey: 'cardImg_youth_virtual',
      defaultBg: 'linear-gradient(135deg,#f59e0b,#d97706)',
      defaultContent: (pc) => `
        <div style="position:relative;height:100%;display:flex;flex-direction:column;justify-content:space-between;padding:1.25rem;background:linear-gradient(135deg,#f59e0b,#d97706);border-radius:1rem;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            <span style="color:white;font-size:1.375rem;font-weight:900;">OPay</span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:flex-end;">
            <span style="color:white;font-size:0.875rem;font-weight:600;">Virtual Card</span>
            <span style="background:white;border-radius:4px;padding:2px 8px;font-weight:900;font-style:italic;color:#ee2b3c;font-size:0.9375rem;">Verve</span>
          </div>
        </div>`,
    },
    {
      id: 'wealth_virtual',
      name: 'OPay Verve Wealth',
      type: 'Virtual Card',
      features: [
        { icon: 'zap', title: 'Designed for your wealth', desc: '<span style="color:VAR_PC;">Instant</span> Access, <span style="color:VAR_PC;">quick</span> application' },
        { icon: 'globe', title: 'Accepted at 40K+ Online Merchants', desc: 'Including <span style="color:VAR_PC;">GooglePlay, Netflix, Glovo, Shein, Jumia, Konga</span>, and more' },
        { icon: 'shopping-bag', title: 'Up to 15% Cashback', desc: '<span style="color:VAR_PC;">Earn cashback</span> on card transactions at GooglePlay, Glovo, Chowdeck &amp; BuyPower till Nov 30, 2026' },
        { icon: 'palette', title: 'NO maintenance fee', desc: 'Free &amp; switch your <span style="color:VAR_PC;">favorite card design</span> anytime' },
        { icon: 'shield-check', title: 'Safe &amp; Secure', desc: '<span style="color:VAR_PC;">CBN</span> licensed, <span style="color:VAR_PC;">NDIC</span> Insured' },
      ],
      price: 800, origPrice: 1000,
      bgKey: 'cardImg_wealth_virtual',
      defaultBg: 'linear-gradient(135deg,#c9a227,#a07b10)',
      defaultContent: (pc) => `
        <div style="position:relative;height:100%;display:flex;flex-direction:column;justify-content:space-between;padding:1.25rem;background:linear-gradient(135deg,#c9a227,#a07b10);border-radius:1rem;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            <span style="color:white;font-size:1.375rem;font-weight:900;">OPay</span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:flex-end;">
            <span style="color:rgba(255,255,255,0.8);font-size:0.875rem;font-weight:600;">Virtual Card</span>
            <span style="background:white;border-radius:4px;padding:2px 8px;font-weight:900;font-style:italic;color:#ee2b3c;font-size:0.9375rem;">Verve</span>
          </div>
        </div>`,
    },
  ];

  const physicalCards = [
    {
      id: 'classic_physical',
      name: 'OPay Verve Classic',
      type: 'Physical Card',
      features: [
        { icon: 'gift', title: 'Free Application and Usage', desc: '<span style="color:VAR_PC;">Free</span> application and <span style="color:VAR_PC;">Zero</span> maintenance fees' },
        { icon: 'globe', title: 'Works Everywhere', desc: 'Accepted globally for online payments, POS, and ATM transactions, including <span style="color:VAR_PC;">Google Play, Netflix, SHEIN, Uber</span> and more' },
        { icon: 'shopping-bag', title: 'Up to 15% Cashback', desc: 'Earn cashback on card transactions at GooglePlay, Glovo, Chowdeck &amp; BuyPower till Nov 30, 2026' },
        { icon: 'shield-check', title: 'Maximum Security', desc: '<span style="color:VAR_PC;">CBN</span> licensed, <span style="color:VAR_PC;">NDIC</span> Insured' },
      ],
      price: null, origPrice: null, isFree: true,
      bgKey: 'cardImg_classic_physical',
      defaultBg: 'linear-gradient(135deg,#e8edf5,#c8d0e0)',
      defaultContent: (pc) => `
        <div style="position:relative;height:100%;display:flex;flex-direction:column;justify-content:space-between;padding:1.25rem;background:linear-gradient(135deg,#e8edf5,#c8d0e0);border-radius:1rem;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            <span style="color:#1a1a2e;font-size:1.375rem;font-weight:900;">OPay</span>
            <span style="background:white;border-radius:4px;padding:2px 8px;font-weight:900;font-style:italic;color:#ee2b3c;">Verve</span>
          </div>
          <div style="width:2.5rem;height:2rem;background:linear-gradient(135deg,#c9a227,#f5dc7a);border-radius:0.25rem;opacity:0.85;"></div>
          <span style="color:#374151;font-size:0.875rem;font-weight:600;">DEBIT</span>
        </div>`,
    },
  ];

  const cards = activeTab === 'virtual' ? virtualCards : physicalCards;
  const card = cards[activeCard] || cards[0];

  function cardVisual(c, isActive) {
    const { primaryColor: pc } = Stores.customization.get();
    const customImg = Stores.customization.get()[c.bgKey];
    const w = isActive ? 280 : 240;
    const h = isActive ? 160 : 140;

    if (customImg) {
      return `<div style="width:${w}px;height:${h}px;border-radius:1rem;overflow:hidden;box-shadow:0 8px 24px -4px rgba(0,0,0,0.25);">
        <img src="${customImg}" style="width:100%;height:100%;object-fit:cover;" /></div>`;
    }
    return `<div style="width:${w}px;height:${h}px;border-radius:1rem;overflow:hidden;box-shadow:0 8px 24px -4px rgba(0,0,0,0.25);background:${c.defaultBg};">
      ${c.defaultContent(pc)}</div>`;
  }

  function render() {
    const { primaryColor: pc } = Stores.customization.get();
    const c = cards[activeCard] || cards[0];
    const expiryHours = '5 Days 12h';

    container.innerHTML = `
    <div style="min-height:100vh;background:#f5f6f8;padding-bottom:5rem;">
      <!-- Header -->
      <div style="background:#f5f6f8;padding:1.25rem 1.25rem 0;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
          <h1 style="font-size:1.5rem;font-weight:900;color:#111827;margin:0;">Cards</h1>
          <button style="background:none;border:none;color:${pc};font-weight:700;font-size:0.9375rem;cursor:pointer;">Q&amp;A</button>
        </div>

        <!-- Tab switcher -->
        <div style="display:flex;justify-content:center;gap:2.5rem;margin-bottom:1.25rem;">
          <div style="text-align:center;">
            <span style="background:#fecdd3;color:#dc2626;font-size:0.625rem;font-weight:800;padding:2px 8px;border-radius:9999px;display:inline-block;margin-bottom:4px;">20% OFF</span>
            <button id="tab-virtual" style="display:block;font-family:cursive;font-size:1rem;font-weight:800;color:${activeTab==='virtual'?'#111827':'#6b7280'};background:none;border:none;cursor:pointer;text-decoration:${activeTab==='virtual'?'underline':'none'};">Virtual Card</button>
            ${activeTab==='virtual' ? `<div style="width:100%;height:3px;background:#111827;border-radius:9999px;margin-top:3px;"></div>` : ''}
          </div>
          <div style="text-align:center;">
            <span style="background:#fecdd3;color:#dc2626;font-size:0.625rem;font-weight:800;padding:2px 8px;border-radius:9999px;display:inline-block;margin-bottom:4px;">25% OFF</span>
            <button id="tab-physical" style="display:block;font-family:cursive;font-size:1rem;font-weight:${activeTab==='physical'?'800':'600'};color:${activeTab==='physical'?'#111827':'#6b7280'};background:none;border:none;cursor:pointer;text-decoration:${activeTab==='physical'?'underline':'none'};">Physical Card</button>
            ${activeTab==='physical' ? `<div style="width:100%;height:3px;background:#111827;border-radius:9999px;margin-top:3px;"></div>` : ''}
          </div>
        </div>
      </div>

      <!-- Card carousel -->
      <div style="position:relative;overflow:hidden;padding:0.5rem 0 1rem;">
        <div id="card-track" style="display:flex;align-items:center;gap:0.75rem;transition:transform 0.35s cubic-bezier(.22,.8,.28,1);padding:0 1.25rem;overflow-x:auto;scrollbar-width:none;">
          ${cards.map((c, i) => `
          <div class="card-slide" data-idx="${i}" style="flex-shrink:0;cursor:pointer;opacity:${i===activeCard?1:0.65};transition:opacity 0.3s,transform 0.3s;transform:${i===activeCard?'scale(1)':'scale(0.92)'};border-radius:1rem;">
            ${cardVisual(c, i===activeCard)}
          </div>`).join('')}
        </div>
        <!-- Dot indicator -->
        <div style="display:flex;justify-content:flex-start;gap:6px;padding:0.5rem 1.25rem 0;">
          ${cards.map((_,i) => `<div style="width:${i===activeCard?'18px':'6px'};height:6px;border-radius:9999px;background:${i===activeCard?'#ef4444':'#d1d5db'};transition:width 0.3s;"></div>`).join('')}
        </div>
      </div>

      <!-- Features card -->
      <div style="background:white;border-radius:0.875rem;margin:0 0.875rem;padding:0.75rem 1.25rem;">
        <div style="text-align:center;padding:0.5rem 0 0.875rem;border-bottom:1px solid #f3f4f6;margin-bottom:0.875rem;">
          <span style="background:#e8f5ec;color:#374151;font-size:0.8125rem;font-weight:700;padding:4px 14px;border-radius:9999px;">${c.name}</span>
        </div>
        ${c.features.map(f => `
        <div style="display:flex;align-items:flex-start;gap:0.875rem;padding:0.625rem 0;border-bottom:1px solid #f9fafb;">
          <div style="width:2.25rem;height:2.25rem;border-radius:0.5rem;background:#e8f5ec;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:${pc};">${Icon(f.icon,{size:18})}</div>
          <div>
            <p style="font-size:0.875rem;font-weight:700;color:#111827;margin:0 0 2px;">${f.title}</p>
            <p style="font-size:0.8125rem;color:#6b7280;margin:0;line-height:1.4;">${f.desc.replace(/VAR_PC/g, pc)}</p>
          </div>
        </div>`).join('')}
      </div>

      <!-- Expiry + CTA -->
      <div style="padding:1rem 1.25rem 0;">
        <p style="text-align:center;font-size:0.875rem;color:#6b7280;margin:0 0 0.75rem;">
          ${c.isFree ? '' : `${activeTab==='virtual'?'Discount':'25% Discount'} expires in <span style="color:${pc};font-weight:700;">${expiryHours}</span>`}
        </p>
        <button id="get-card-btn" style="width:100%;background:${pc};color:white;border:none;border-radius:9999px;padding:1rem;font-weight:700;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.5rem;">
          <span>₦</span>
          ${c.isFree
            ? 'Get It Now'
            : `Get It for just <s>₦${c.price}</s> ₦${c.origPrice}`}
        </button>
      </div>

      ${AuthState.isAdmin ? `
      <div style="margin:1rem 1.25rem 0;background:white;border-radius:0.875rem;padding:1rem;">
        <p style="font-size:0.875rem;font-weight:700;color:#374151;margin:0 0 0.75rem;">Admin: Upload Card Image</p>
        <p style="font-size:0.8125rem;color:#6b7280;margin:0 0 0.75rem;">Current: ${c.name}</p>
        <label style="display:flex;align-items:center;gap:0.5rem;background:#f9fafb;border:1.5px dashed #d1d5db;border-radius:0.75rem;padding:0.75rem 1rem;cursor:pointer;">
          ${Icon('upload',{size:18,color:'#6b7280'})}
          <span style="font-size:0.875rem;color:#6b7280;">Upload card image</span>
          <input id="card-img-upload" type="file" accept="image/*" style="display:none;" />
        </label>
      </div>` : ''}

      ${BottomNav('cards')}
    </div>`;

    container.querySelector('#tab-virtual').addEventListener('click', () => { activeTab='virtual'; activeCard=0; render(); });
    container.querySelector('#tab-physical').addEventListener('click', () => { activeTab='physical'; activeCard=0; render(); });

    container.querySelectorAll('.card-slide').forEach(el => {
      el.addEventListener('click', () => { activeCard = parseInt(el.dataset.idx); render(); });
    });

    // Swipe
    const track = container.querySelector('#card-track');
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, {passive:true});
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        if (diff > 0 && activeCard < cards.length - 1) activeCard++;
        else if (diff < 0 && activeCard > 0) activeCard--;
        render();
      }
    }, {passive:true});

    container.querySelector('#get-card-btn').addEventListener('click', () => toast('Card application coming soon'));

    const imgUpload = container.querySelector('#card-img-upload');
    if (imgUpload) {
      imgUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const fd = new FormData();
        fd.append('file', file);
        fd.append('type', 'card');
        const res = await fetch('/api/upload', { method:'POST', credentials:'include', body: fd });
        const data = await res.json();
        if (data.ok && data.url) {
          const cust = { ...Stores.customization.get(), [cards[activeCard].bgKey]: data.url };
          Stores.customization.set(cust);
          await fetch('/api/customization', { method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include', body: JSON.stringify(cust) });
          toast.success('Card image updated');
          render();
        } else {
          toast.error(data.error || 'Upload failed');
        }
      });
    }

    bindBottomNav(container);
  }

  render();
}

window.renderCardsPage = renderCardsPage;
