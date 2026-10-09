// Nigerian Banks Database with real logo images (Cloudinary CDN - cached by browser after first load)
const NIGERIAN_BANKS = [
  { name: "Access Bank", code: "044", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731835318/access-bank_u0pg90.png" },
  { name: "Guaranty Trust Bank (GTB)", code: "058", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731834954/Guaranty_Trust_Bank_odgbdu.png" },
  { name: "First Bank of Nigeria", code: "011", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731835216/First_Bank_of_Nigeria_drawyb.png" },
  { name: "Zenith Bank", code: "057", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731908201/Zenith_Bank_h40m09.png" },
  { name: "United Bank for Africa (UBA)", code: "033", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731908162/United_Bank_For_Africa_om7axi.png" },
  { name: "Stanbic IBTC Bank", code: "221", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731908079/Stanbic_IBTC_Bank_qjczcl.png" },
  { name: "Standard Chartered Bank", code: "068", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731908084/Standard_Chartered_Bank_vrrfp5.png" },
  { name: "First City Monument Bank (FCMB)", code: "214", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731835213/First_City_Monument_Bank_aeufbo.png" },
  { name: "Fidelity Bank", code: "070", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731835222/Fidelity_Bank_lkl2mr.png" },
  { name: "Ecobank Nigeria", code: "050", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731835234/Ecobank_Nigeria_qdd70j.png" },
  { name: "Wema Bank", code: "035", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731908191/Wema_Bank_cr2pvu.png" },
  { name: "Union Bank of Nigeria", code: "032", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731908157/Union_Bank_of_Nigeria_i8mtrj.png" },
  { name: "Polaris Bank", code: "076", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731907984/Polaris_Bank_irqlkv.png" },
  { name: "Titan Bank", code: "102", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731908123/Titan_Bank_dgfjd9.png" },
  { name: "Sterling Bank", code: "232", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731908098/Sterling_Bank_ooipqt.png" },
  { name: "Jaiz Bank", code: "301", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731835113/Jaiz_Bank_fambas.png" },
  { name: "Providus Bank", code: "101", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731908004/Providus_Bank_oo0ue2.png" },
  { name: "Keystone Bank", code: "082", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1731835110/Keystone-Bank_cvicmd.png" },
  { name: "Unity Bank", code: "215", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731908167/Unity_Bank_uprqwi.png" },
  { name: "Citibank Nigeria", code: "023", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731835252/Citibank_Nigeria_cjd5ma.png" },
  { name: "Globus Bank", code: "00103", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731834952/Globus_Bank_d1oapw.png" },
  { name: "PremiumTrust Bank", code: "105", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731907996/PremiumTrust_Bank_zsds6j.png" },
  { name: "Optimus Bank", code: "107", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731907931/Optimus_Bank_Limited_g9ezm9.png" },
  { name: "Parallex Bank", code: "104", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731907940/Parallex_Bank_pjbwex.png" },
  { name: "Signature Bank", code: "106", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731908070/Signature_Bank_Ltd_lzz18z.png" },
  { name: "Lotus Bank", code: "303", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1731835025/Lotus_Bank_ykfh6u.png" },
  { name: "TAJ Bank", code: "302", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731908109/TAJ_Bank_gyek38.png" },
  { name: "Suntrust Bank", code: "100", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731908103/Suntrust_Bank_wnlowk.png" },
  { name: "NOVA Bank", code: "561", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731907915/NOVA_BANK_jmoqc2.png" },
  { name: "Coronation Merchant Bank", code: "559", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731834972/Coronation_Merchant_Bank_vnoj5c.png" },
  { name: "Greenwich Merchant Bank", code: "562", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731835198/Greenwich_Merchant_Bank_ounvcu.png" },
  { name: "Rand Merchant Bank", code: "502", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731908015/Rand_Merchant_Bank_f6s9bp.webp" },
  { name: "FSDH Merchant Bank", code: "501", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731835210/FSDH_Merchant_Bank_Limited_dzr9ou.png" },
  { name: "Kuda Bank", code: "50211", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1731835102/Kuda_Bank_f5nrij.png" },
  { name: "Moniepoint MFB", code: "50515", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731907889/Moniepoint_MFB_hxoelg.png" },
  { name: "OPay Digital Services", code: "999992", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731910673/OPay_Digital_Services_Limited__OPay_zyh5d0.png" },
  { name: "PalmPay", code: "999991", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731910656/PalmPay_lzs7yt.png" },
  { name: "Paga", code: "100002", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731907935/Paga_porukh.png" },
  { name: "Carbon", code: "565", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731835272/Carbon_olhrz6.png" },
  { name: "Eyowo", code: "50126", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731835225/Eyowo_hq52rd.png" },
  { name: "FairMoney MFB", code: "51318", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731834992/Fairmoney_Microfinance_Bank_idowum.png" },
  { name: "Sparkle Microfinance Bank", code: "51310", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731908074/Sparkle_Microfinance_Bank_vgopsi.png" },
  { name: "VFD Microfinance Bank", code: "566", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731908181/VFD_Microfinance_Bank_Limited_npn5fv.png" },
  { name: "Rubies MFB", code: "125", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731908045/Rubies_MFB_gx6frx.png" },
  { name: "Mint MFB", code: "50304", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731837518/default_tzmdd0.png" },
  { name: "Airtel Smartcash PSB", code: "120004", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731834962/Airtel_Smartcash_PSB_oxqa5c.png" },
  { name: "MTN Momo PSB", code: "120003", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731907895/MTN_Momo_PSB_rorvc4.png" },
  { name: "9mobile 9Payment Service Bank", code: "120001", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731835326/9PSB-logo-white-text_lz7cq4.png" },
  { name: "HopePSB", code: "120002", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1731835189/HopePSB_u7fakn.png" },
  { name: "U and C MFB", code: "50840", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731908128/U_C_Microfinance_Bank_Ltd__U_AND_C_MFB_iundlq.png" },
  { name: "UCEE MFB", code: "090706", logo: "https://res.cloudinary.com/dweovytuc/image/upload/f_auto,q_auto/v1731908133/UCEE_MFB_hinprt.png" }
];

// Preload all bank logo images once so they cache in browser memory.
// After the first load, browser HTTP cache serves them instantly with no repeated network requests.
(function preloadBankLogos() {
  NIGERIAN_BANKS.forEach((bank) => {
    const img = new Image();
    img.src = bank.logo;
  });
})();

window.NIGERIAN_BANKS = NIGERIAN_BANKS;
