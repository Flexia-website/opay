// ---- Simple persisted store helper (replaces zustand + persist middleware) ----
function createStore(name, initial, persistKeys) {
  const listeners = new Set();
  let state = { ...initial };

  const saved = localStorage.getItem(name);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state = { ...state, ...parsed };
    } catch (e) { /* ignore corrupt data */ }
  }

  function persist() {
    if (!persistKeys) {
      localStorage.setItem(name, JSON.stringify(state));
      return;
    }
    const toSave = {};
    persistKeys.forEach((k) => (toSave[k] = state[k]));
    localStorage.setItem(name, JSON.stringify(toSave));
  }

  function get() {
    return state;
  }

  function set(partial) {
    const update = typeof partial === "function" ? partial(state) : partial;
    state = { ...state, ...update };
    persist();
    listeners.forEach((fn) => fn(state));
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  return { get, set, subscribe };
}

// ---- Balance store ----
const balanceStore = createStore("opay-balance-storage", { 
  balance: 80754,
  accountNumber: "08160881049",
  accountName: "EJIOFOR-BENJAMIN CLINTON",
  bank: "OPay"
});

// ---- Cashback store ----
const cashbackStore = createStore("opay-cashback-storage", { totalCashback: 0 });
cashbackStore.addCashback = (amount) =>
  cashbackStore.set((s) => ({ totalCashback: s.totalCashback + amount }));
cashbackStore.useCashback = (amount) =>
  cashbackStore.set((s) => ({ totalCashback: Math.max(0, s.totalCashback - amount) }));

// ---- Customization store ----
const customizationStore = createStore(
  "opay-customization",
  {
    primaryColor: "#00B875",
    secondaryColor: "#1C1D37",
    profilePhoto: "",
    profilePhotoSize: 1,
    buttonImages: {},
    buttonBackgroundColor: "#F5F5F7",
    networkImages: {},
  },
  ["primaryColor", "secondaryColor", "profilePhoto", "profilePhotoSize", "buttonImages", "buttonBackgroundColor", "networkImages"]
);
customizationStore.setButtonImage = (key, url) =>
  customizationStore.set((s) => ({ buttonImages: { ...s.buttonImages, [key]: url } }));
customizationStore.resetButtonImage = (key) =>
  customizationStore.set((s) => {
    const bi = { ...s.buttonImages };
    delete bi[key];
    return { buttonImages: bi };
  });
customizationStore.resetAllButtonImages = () => customizationStore.set({ buttonImages: {} });
customizationStore.setNetworkImage = (key, url) =>
  customizationStore.set((s) => ({ networkImages: { ...s.networkImages, [key]: url } }));
customizationStore.resetNetworkImage = (key) =>
  customizationStore.set((s) => {
    const ni = { ...s.networkImages };
    delete ni[key];
    return { networkImages: ni };
  });
customizationStore.resetAllNetworkImages = () => customizationStore.set({ networkImages: {} });

// ---- Safebox store ----
const safeboxStore = createStore("safebox-storage", {
  safeboxBalance: 15000,
  safeboxGoal: 50000,
  lockedSavings: [],
});
safeboxStore.addLockedSaving = (saving) =>
  safeboxStore.set((s) => ({
    lockedSavings: [...s.lockedSavings, saving],
    safeboxBalance: s.safeboxBalance - saving.amount,
  }));
safeboxStore.removeLockedSaving = (id) => {
  const s = safeboxStore.get();
  const saving = s.lockedSavings.find((x) => x.id === id);
  if (!saving) return 0;
  const daysLocked = Math.floor(
    (new Date().getTime() - new Date(saving.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  const interest = (saving.amount * saving.interestRate * daysLocked) / (365 * 100);
  const totalAmount = saving.amount + interest;
  safeboxStore.set((st) => ({
    lockedSavings: st.lockedSavings.filter((x) => x.id !== id),
    safeboxBalance: st.safeboxBalance + totalAmount,
  }));
  return totalAmount;
};
safeboxStore.updateSafeboxBalance = (amount) =>
  safeboxStore.set((s) => ({ safeboxBalance: s.safeboxBalance + amount }));

// ---- Transaction store ----
const transactionStore = createStore("opay-transactions", {
  transactions: [
    {
      id: "1",
      type: "Bonus from Data Purchase",
      amount: "+₦2.70",
      date: "Feb 14th, 14:35:44",
      status: "Successful",
      icon: "gift",
    },
    {
      id: "2",
      type: "Mobile data",
      amount: "-₦270.00",
      date: "Feb 14th, 14:35:28",
      status: "Successful",
      icon: "smartphone",
    },
  ],
});
transactionStore.addTransaction = (transaction) =>
  transactionStore.set((s) => ({
    transactions: [
      { id: Date.now().toString(), date: new Date().toLocaleString(), ...transaction },
      ...s.transactions,
    ],
  }));
transactionStore.addCreditAlert = (senderName, amount) =>
  transactionStore.set((s) => ({
    transactions: [
      {
        id: Date.now().toString(),
        type: `Transfer from ${senderName}`,
        amount: `+₦${amount.toLocaleString()}`,
        date: new Date().toLocaleString(),
        status: "Successful",
        icon: "credit-card",
      },
      ...s.transactions,
    ],
  }));
transactionStore.clearHistory = () => transactionStore.set({ transactions: [] });

window.Stores = {
  balance: balanceStore,
  cashback: cashbackStore,
  customization: customizationStore,
  safebox: safeboxStore,
  transaction: transactionStore,
};

// ---- Networks (shared across Airtime & Data pages) ----
window.NETWORKS = [
  { id: "mtn", name: "MTN", color: "#FFCB05", textColor: "#111827" },
  { id: "airtel", name: "Airtel", color: "#FF0000", textColor: "#ffffff" },
  { id: "glo", name: "GLO", color: "#00A651", textColor: "#ffffff" },
  { id: "t2mobile", name: "T2 Mobile", color: "#F97316", textColor: "#ffffff" },
  { id: "vitel", name: "VITEL", color: "#0EA5E9", textColor: "#ffffff" },
];

// ---- Data plans (static data, no persistence needed) ----
window.DataPlans = [
  { id: 'mtn_night_500mb', price: 150, size: '500MB', validity: '1 night', category: 'night', network: 'mtn', description: '12AM - 5AM' },
  { id: 'mtn_night_1gb', price: 250, size: '1GB', validity: '7 nights', category: 'night', network: 'mtn', description: '12AM - 5AM' },
  { id: 'mtn_night_2.5gb', price: 500, size: '2.5GB', validity: '7 nights', category: 'night', network: 'mtn', description: '12AM - 5AM' },
  { id: 'mtn_social_200mb', price: 100, size: '200MB', validity: '1 day', category: 'social', network: 'mtn', description: 'WhatsApp Only' },
  { id: 'mtn_social_500mb', price: 300, size: '500MB', validity: '7 days', category: 'social', network: 'mtn', description: 'WhatsApp, Facebook, Twitter, etc.' },
  { id: 'mtn_weekly_1gb', price: 1000, size: '1GB', validity: '7 days', category: 'weekly_monthly', network: 'mtn' },
  { id: 'mtn_monthly_2gb', price: 2400, size: '2GB', validity: '30 days', category: 'weekly_monthly', network: 'mtn' },
  { id: 'mtn_monthly_5gb', price: 5500, size: '5GB', validity: '30 days', category: 'weekly_monthly', network: 'mtn' },
  { id: 'mtn_mega_20gb', price: 15000, size: '20GB', validity: '30 days', category: 'mega', network: 'mtn' },
  { id: 'mtn_mega_50gb', price: 30000, size: '50GB', validity: '30 days', category: 'mega', network: 'mtn' },
  { id: 'mtn_mega_100gb', price: 50000, size: '100GB', validity: '30 days', category: 'mega', network: 'mtn' },
  { id: 'airtel_night_1gb', price: 200, size: '1GB', validity: '7 nights', category: 'night', network: 'airtel', description: '12AM - 6AM' },
  { id: 'airtel_night_3gb', price: 500, size: '3GB', validity: '7 nights', category: 'night', network: 'airtel', description: '12AM - 6AM' },
  { id: 'airtel_social_250mb', price: 200, size: '250MB', validity: '1 day', category: 'social', network: 'airtel', description: 'WhatsApp/FB/IG' },
  { id: 'airtel_social_1gb', price: 500, size: '1GB', validity: '7 days', category: 'social', network: 'airtel', description: 'All Social Apps' },
  { id: 'airtel_weekly_1gb', price: 1000, size: '1GB', validity: '14 days', category: 'weekly_monthly', network: 'airtel' },
  { id: 'airtel_monthly_3gb', price: 3000, size: '3GB', validity: '30 days', category: 'weekly_monthly', network: 'airtel' },
  { id: 'airtel_monthly_10gb', price: 10000, size: '10GB', validity: '30 days', category: 'weekly_monthly', network: 'airtel' },
  { id: 'airtel_mega_25gb', price: 15000, size: '25GB', validity: '30 days', category: 'mega', network: 'airtel' },
  { id: 'airtel_mega_60gb', price: 35000, size: '60GB', validity: '30 days', category: 'mega', network: 'airtel' },
  { id: 'airtel_mega_120gb', price: 60000, size: '120GB', validity: '30 days', category: 'mega', network: 'airtel' },
  { id: 'glo_night_1gb', price: 200, size: '1GB', validity: '7 nights', category: 'night', network: 'glo', description: '1AM - 5AM' },
  { id: 'glo_night_3gb', price: 400, size: '3GB', validity: '7 nights', category: 'night', network: 'glo', description: '1AM - 5AM' },
  { id: 'glo_social_500mb', price: 150, size: '500MB', validity: '1 day', category: 'social', network: 'glo', description: 'WhatsApp Only' },
  { id: 'glo_social_2gb', price: 500, size: '2GB', validity: '7 days', category: 'social', network: 'glo', description: 'All Social Apps' },
  { id: 'glo_weekly_2gb', price: 500, size: '2GB', validity: '7 days', category: 'weekly_monthly', network: 'glo' },
  { id: 'glo_monthly_5gb', price: 3500, size: '5GB', validity: '30 days', category: 'weekly_monthly', network: 'glo' },
  { id: 'glo_monthly_10gb', price: 5500, size: '10GB', validity: '30 days', category: 'weekly_monthly', network: 'glo' },
  { id: 'glo_mega_30gb', price: 15000, size: '30GB', validity: '30 days', category: 'mega', network: 'glo' },
  { id: 'glo_mega_100gb', price: 40000, size: '100GB', validity: '30 days', category: 'mega', network: 'glo' },
  { id: '9mobile_night_1gb', price: 200, size: '1GB', validity: '7 nights', category: 'night', network: '9mobile', description: '12AM - 4AM' },
  { id: '9mobile_night_5gb', price: 500, size: '5GB', validity: '7 nights', category: 'night', network: '9mobile', description: '12AM - 4AM' },
  { id: '9mobile_social_150mb', price: 100, size: '150MB', validity: '1 day', category: 'social', network: '9mobile', description: 'WhatsApp Only' },
  { id: '9mobile_social_1gb', price: 400, size: '1GB', validity: '7 days', category: 'social', network: '9mobile', description: 'All Social Apps' },
  { id: '9mobile_weekly_1gb', price: 800, size: '1GB', validity: '7 days', category: 'weekly_monthly', network: '9mobile' },
  { id: '9mobile_monthly_4.5gb', price: 3500, size: '4.5GB', validity: '30 days', category: 'weekly_monthly', network: '9mobile' },
  { id: '9mobile_monthly_11gb', price: 6500, size: '11GB', validity: '30 days', category: 'weekly_monthly', network: '9mobile' },
  { id: '9mobile_mega_30gb', price: 15000, size: '30GB', validity: '30 days', category: 'mega', network: '9mobile' },
  { id: '9mobile_mega_100gb', price: 45000, size: '100GB', validity: '30 days', category: 'mega', network: '9mobile' },
  { id: 't2mobile_night_1gb', price: 180, size: '1GB', validity: '7 nights', category: 'night', network: 't2mobile', description: '12AM - 5AM' },
  { id: 't2mobile_night_3gb', price: 450, size: '3GB', validity: '7 nights', category: 'night', network: 't2mobile', description: '12AM - 5AM' },
  { id: 't2mobile_social_300mb', price: 120, size: '300MB', validity: '1 day', category: 'social', network: 't2mobile', description: 'WhatsApp Only' },
  { id: 't2mobile_social_1gb', price: 350, size: '1GB', validity: '7 days', category: 'social', network: 't2mobile', description: 'All Social Apps' },
  { id: 't2mobile_weekly_1gb', price: 950, size: '1GB', validity: '7 days', category: 'weekly_monthly', network: 't2mobile' },
  { id: 't2mobile_monthly_3gb', price: 2600, size: '3GB', validity: '30 days', category: 'weekly_monthly', network: 't2mobile' },
  { id: 't2mobile_monthly_6gb', price: 5000, size: '6GB', validity: '30 days', category: 'weekly_monthly', network: 't2mobile' },
  { id: 't2mobile_mega_25gb', price: 14000, size: '25GB', validity: '30 days', category: 'mega', network: 't2mobile' },
  { id: 't2mobile_mega_60gb', price: 32000, size: '60GB', validity: '30 days', category: 'mega', network: 't2mobile' },
  { id: 'vitel_night_1gb', price: 190, size: '1GB', validity: '7 nights', category: 'night', network: 'vitel', description: '12AM - 5AM' },
  { id: 'vitel_night_3gb', price: 480, size: '3GB', validity: '7 nights', category: 'night', network: 'vitel', description: '12AM - 5AM' },
  { id: 'vitel_social_300mb', price: 130, size: '300MB', validity: '1 day', category: 'social', network: 'vitel', description: 'WhatsApp Only' },
  { id: 'vitel_social_1gb', price: 380, size: '1GB', validity: '7 days', category: 'social', network: 'vitel', description: 'All Social Apps' },
  { id: 'vitel_weekly_1gb', price: 980, size: '1GB', validity: '7 days', category: 'weekly_monthly', network: 'vitel' },
  { id: 'vitel_monthly_3gb', price: 2700, size: '3GB', validity: '30 days', category: 'weekly_monthly', network: 'vitel' },
  { id: 'vitel_monthly_6gb', price: 5200, size: '6GB', validity: '30 days', category: 'weekly_monthly', network: 'vitel' },
  { id: 'vitel_mega_25gb', price: 14500, size: '25GB', validity: '30 days', category: 'mega', network: 'vitel' },
  { id: 'vitel_mega_60gb', price: 33000, size: '60GB', validity: '30 days', category: 'mega', network: 'vitel' },
];
window.getDataPlansByCategory = (network, category) => DataPlans.filter(p => p.network === network && p.category === category);
