# ग्राम सहायक ऐप — सेटअप गाइड

यह गाइड बताती है कि `app.html` को **डेमो मोड** से **असली ऐप** कैसे बनाएँ, जिसमें OTP लॉगिन, फ़ाइल अपलोड, भुगतान और WhatsApp अपडेट काम करें।

जब तक `app.html` में Firebase की जानकारी नहीं डाली जाती, ऐप डेमो मोड में चलता है। डेमो में कोई भी नंबर डालें, OTP **123456** है, और कुछ भी सेव नहीं होता।

---

## भाग 1: Firebase (लॉगिन, डेटा और फ़ाइलें)

### 1. प्रोजेक्ट बनाएँ
1. [console.firebase.google.com](https://console.firebase.google.com) पर अपने Google खाते से जाएँ।
2. **Add project** दबाएँ, नाम `gram-sahayak` रखें और Create करें। Google Analytics बंद रख सकते हैं।

### 2. Blaze प्लान चालू करें
मोबाइल OTP और फ़ाइल स्टोरेज के लिए Firebase **Blaze (pay-as-you-go)** प्लान माँगता है। इसमें छोटे इस्तेमाल पर बहुत कम खर्च आता है, पर OTP SMS का थोड़ा शुल्क लगता है।
1. नीचे बाईं ओर **Upgrade** दबाएँ और बिलिंग खाता जोड़ें।
2. **Budget alert** ज़रूर लगाएँ, जैसे ₹500 महीना, ताकि खर्च बढ़ते ही ईमेल आ जाए।
3. सही रेट के लिए [Firebase pricing](https://firebase.google.com/pricing) देखें।

### 3. मोबाइल OTP लॉगिन चालू करें
1. **Build → Authentication → Get started** पर जाएँ।
2. **Sign-in method** में **Phone** चुनें और Enable करें।
3. **Settings → Authorized domains** में **Add domain** दबाएँ और डालें:
   `computergyanjarurihai-web.github.io`
   बाद में अपना डोमेन, जैसे `gramsahayak.in`, लें तो उसे भी यहाँ जोड़ें।

### 4. डेटाबेस (Firestore)
1. **Build → Firestore Database → Create database** पर जाएँ।
2. Location **asia-south1 (Mumbai)** चुनें और **production mode** में बनाएँ।
3. **Rules** टैब में इस रिपॉज़िटरी की `firestore.rules` फ़ाइल का पूरा हिस्सा कॉपी करें और **Publish** दबाएँ।

### 5. फ़ाइल स्टोरेज (Storage)
1. **Build → Storage → Get started** पर जाएँ। Location वही Mumbai रखें।
2. **Rules** टैब में `storage.rules` फ़ाइल का पूरा हिस्सा कॉपी करें और **Publish** दबाएँ।
3. अगर Rules पूछे कि Storage को Firestore पढ़ने की अनुमति दें, तो **Allow** करें।

### 6. ऐप को Firebase से जोड़ें
1. **Project settings** (⚙️) में **Your apps** के नीचे **Web (</>)** आइकन दबाएँ।
2. नाम `gram-sahayak-web` रखें और **Register app** दबाएँ।
3. एक `firebaseConfig = { ... }` दिखेगा। उसे कॉपी करें।
4. GitHub पर `app.html` खोलें, ✏️ (Edit) दबाएँ, और ऊपर `CONFIG` में यह बदलें:
   ```js
   firebase: null,
   ```
   की जगह:
   ```js
   firebase: { apiKey:"...", authDomain:"...", projectId:"...", storageBucket:"...", messagingSenderId:"...", appId:"..." },
   ```
5. **Commit changes** दबाएँ। 1–2 मिनट बाद ऐप असली मोड में चलेगा और डेमो वाली पीली पट्टी गायब हो जाएगी।

> यह `apiKey` गुप्त नहीं होती। इसे वेबसाइट में रखना सामान्य है। सुरक्षा ऊपर वाले Rules से होती है।

### 7. खुद को Admin बनाएँ
1. ऐप खोलें, अपने मोबाइल से OTP लॉगिन करें और अपनी जानकारी भरें।
2. Firebase में **Firestore Database → Data → users** खोलें और अपना दस्तावेज़ ढूँढें (आपका नंबर `phone` में दिखेगा)।
3. `role` फ़ील्ड को `family` से बदलकर **`admin`** करें।
4. ऐप रीफ़्रेश करें। अब **प्रबंधन** टैब दिखेगा।

### 8. सहायक कैसे जुड़ेंगे
1. सहायक भी ऐप में लॉगिन करके नीचे **सहायक के लिए आवेदन करें** दबाएगा।
2. पुलिस सत्यापन, गारंटर और इंटरव्यू के बाद आप **प्रबंधन → सहायक आवेदन** में **मंज़ूरी दें** दबाएँ।
3. उसके बाद उसे **सहायक डेस्क** दिखेगा, जिसमें उसके प्रखंड के केस होंगे।

---

## भाग 2: भुगतान

### अभी: सीधे UPI (शुरुआत के लिए सबसे आसान)
1. अपने बैंक खाते की UPI ID लें। बेहतर है कि यह संस्था के करंट खाते की हो।
2. `app.html` के `CONFIG` में डालें: `upiId: "gramsahayak@sbi",`
3. परिवार **भुगतान करें** दबाएगा, UPI ऐप खुलेगा जिसमें राशि पहले से भरी होगी, और भुगतान के बाद वह UTR नंबर डालेगा।
4. आप **प्रबंधन → भुगतान जाँच** में UTR को बैंक स्टेटमेंट से मिलाकर **पक्का करें** दबाएँगे।

### बाद में: Razorpay (UPI, कार्ड, नेटबैंकिंग)
1. [razorpay.com](https://razorpay.com) पर खाता बनाएँ और PAN, बैंक खाता व व्यवसाय के काग़ज़ से KYC पूरी करें।
2. **Settings → API Keys** से **Key Id** (`rzp_live_...`) लें और `CONFIG` में `razorpayKey` में डालें।
3. ऐप में **UPI / कार्ड से भुगतान** बटन दिखने लगेगा।
4. पायलट में भुगतान को Razorpay डैशबोर्ड से मिलाकर ऐप में पक्का करें। बड़े स्तर पर इसके लिए एक छोटा सर्वर (Cloud Function) बनाना होगा जो भुगतान अपने-आप जाँचे।

---

## भाग 3: WhatsApp अपडेट

### अभी: एक टैप में WhatsApp
सहायक जब भी अपडेट सेव करता है, ऐप एक तैयार संदेश दिखाता है, जैसे:

> ग्राम सहायक: आपका केस GS-MUT01 (8 महीने से दाखिल-खारिज लंबित)
> स्थिति: काम चल रहा
> अंचल कार्यालय में राजस्व कर्मचारी से मिले।
> अगली तारीख: 28 अक्टूबर

**परिवार को WhatsApp** दबाते ही WhatsApp खुलता है जिसमें परिवार का नंबर और संदेश पहले से भरे होते हैं। सहायक को सिर्फ़ Send दबाना होता है। इसमें कोई खर्च नहीं है।

### बाद में: अपने-आप WhatsApp (बिना सहायक के टैप के)
ऐप हर अपडेट Firestore के `notifications` संग्रह में भी लिख देता है। अपने-आप भेजने के लिए:
1. AiSensy, Interakt या Gupshup में WhatsApp Business API खाता लें। इसके लिए एक अलग मोबाइल नंबर और Facebook Business सत्यापन चाहिए।
2. एक **utility template** मंज़ूर कराएँ, जैसे: `आपका केस {{1}}: {{2}}। अगली तारीख: {{3}}`
3. एक Firebase Cloud Function बनवाएँ जो `notifications` में नया दस्तावेज़ आते ही provider के API से संदेश भेज दे।
4. खर्च: AiSensy के अनुसार भारत में utility संदेश लगभग ₹0.145 प्रति संदेश है, और provider का मासिक प्लान अलग से।

---

## भाग 4: डेटा सुरक्षा (DPDP Act)

1. `privacy.html` में शिकायत अधिकारी का ईमेल भरें (`EMAIL_TO_ADD` की जगह)।
2. नए `firestore.rules` को Firebase → Firestore → Rules में दोबारा पेस्ट करके **Publish** करें। इससे admin केस का छिपा मोबाइल नंबर भी हटा पाएगा।
3. कोई **“मेरा डेटा हटाएँ”** दबाए, तो **प्रबंधन → डेटा हटाने के अनुरोध** में 30 दिन के अंदर **डेटा हटाएँ** दबाएँ।
4. उसके बाद Firebase → **Authentication → Users** में उस मोबाइल नंबर की पंक्ति के ⋮ से **Delete account** करें।
5. केस बंद होने के 2 साल बाद पुराने केस की फ़ाइलें हटाएँ (अभी हाथ से; बाद में Cloud Function से अपने-आप)।
6. गोपनीयता नीति बदलें तो `app.html` के `CONFIG` में `privacyVersion` की तारीख़ बदलें; सबसे दोबारा सहमति ली जाएगी।

---

## भाग 4.1: पंजाब (दूसरा राज्य)
1. `locations-punjab.js`, `locations-haryana.js` और `locations-himachal.js` फ़ाइलें रिपॉज़िटरी में `app.html` के साथ रखें।
2. नया `firestore.rules` Firebase में दोबारा **Publish** करें। अब सहायक का मिलान "राज्य|ज़िला|प्रखंड/तहसील" (blockKey) से होता है, ताकि दो ज़िलों के एक जैसे नाम वाले प्रखंड आपस में न मिलें।
3. पुराने केस जिनमें blockKey नहीं है, सहायक की "खुले केस" सूची में नहीं आएँगे; उन्हें प्रबंधन से सीधे सहायक को सौंपें।

## भाग 5: अतिरिक्त सुरक्षा

### A. 2-Step Verification (सबसे ज़रूरी, 5 मिनट)
जिस Google खाते से Firebase बनाया है, वह हैक हुआ तो सारा डेटा खुल जाएगा। इसलिए:
1. [myaccount.google.com/security](https://myaccount.google.com/security) खोलें।
2. **2-Step Verification** चालू करें। बेहतर है **Passkey** या **Google Authenticator** ऐप, सिर्फ़ SMS नहीं।
3. **Backup codes** निकालकर कहीं सुरक्षित रखें।
4. Firebase → ⚙️ **Users and permissions** में देखें कि कोई अनजान व्यक्ति न जुड़ा हो।

### B. App Check (सिर्फ़ आपकी वेबसाइट डेटाबेस से बात कर सके)
1. [google.com/recaptcha/admin/create](https://www.google.com/recaptcha/admin/create) खोलें, **reCAPTCHA v3** चुनें, Domain में `computergyanjarurihai-web.github.io` डालें, Submit करें। **Site key** कॉपी करें। **Secret key** भी कॉपी करें।
2. Firebase → **Build → App Check → Apps** → अपना web app → **reCAPTCHA** → Secret key पेस्ट करके Save करें।
3. `app.html` के `CONFIG` में डालें: `appCheckKey: "आपका-site-key",` और GitHub पर अपलोड करें।
4. 2–3 दिन App Check → **APIs** में देखें कि ज़्यादातर अनुरोध **Verified** हैं।
5. फिर **Cloud Firestore**, **Storage** और **Authentication** पर **Enforce** दबाएँ।

### C. मोबाइल नंबर और खाता/खेसरा का एन्क्रिप्शन (vault)
Firebase सारा डेटा डिस्क पर पहले से एन्क्रिप्ट करता है। vault इसके ऊपर एक और ताला है: मोबाइल नंबर और खाता/खेसरा डेटाबेस में `enc:v1:...` बनकर रहते हैं, और सिर्फ़ परिवार, उस केस का सहायक और admin उन्हें खोल पाते हैं। चाबी Google Secret Manager में रहती है, वेबसाइट में नहीं।

1. GitHub रिपॉज़िटरी में `vault` फ़ोल्डर अपलोड करें (उसमें `index.js`, `package.json`, `deploy.sh`)। **Add file → Upload files** में पूरा फ़ोल्डर खींचकर डालें।
2. [console.cloud.google.com](https://console.cloud.google.com) खोलें, ऊपर प्रोजेक्ट **gramsahayak-579fa** चुनें, और ऊपर दाईं ओर **Cloud Shell** (`>_`) आइकन दबाएँ।
3. नीचे खुली काली स्क्रीन में ये तीन लाइनें पेस्ट करके Enter दबाएँ:
   ```
   gcloud config set project gramsahayak-579fa
   git clone https://github.com/computergyanjarurihai-web/GaonSahayak.git
   cd GaonSahayak/vault && bash deploy.sh
   ```
4. 3–5 मिनट बाद आख़िर में एक पता दिखेगा, जैसे `https://gs-vault-xxxx-el.a.run.app`। उसे `app.html` के `CONFIG` में डालें: `vaultUrl: "वह-पता",` और GitHub पर अपलोड करें।
5. ऐप में admin से लॉगिन करें → **प्रबंधन → एन्क्रिप्शन → पुराना डेटा एन्क्रिप्ट करें** दबाएँ।
6. जाँचें: Firestore → cases में किसी केस का `land` अब `enc:v1:` से शुरू होना चाहिए, और ऐप में 🔒 **देखें** दबाने पर असली खाता/खेसरा दिखना चाहिए।
7. App Check enforce करने के बाद vault में भी चालू करें (Cloud Shell में):
   ```
   gcloud functions deploy gs-vault --gen2 --region=asia-south1 --update-env-vars=REQUIRE_APPCHECK=true --source=. --quiet
   ```

> ⚠️ Secret Manager की चाबी `gs-field-key` कभी डिलीट न करें और उसका नया version न बनाएँ। चाबी गई तो एन्क्रिप्टेड नंबर कभी नहीं खुलेंगे।
> खर्च: इतने कम इस्तेमाल में Cloud Run और Secret Manager लगभग मुफ़्त सीमा में रहते हैं।
> ध्यान दें: Firebase Authentication में लॉगिन वाला मोबाइल नंबर Google ख़ुद रखता है (वह भी एन्क्रिप्टेड डिस्क पर); उसे vault नहीं बदलता।

---

## जाँच सूची (सेटअप के बाद)

- [ ] अपने मोबाइल से OTP लॉगिन हुआ
- [ ] एक टेस्ट केस फ़ोटो के साथ भेजा, फ़ोटो खुल रही है
- [ ] खुद को admin बनाया, **प्रबंधन** टैब दिखा
- [ ] दूसरे नंबर से सहायक आवेदन किया और मंज़ूरी दी
- [ ] सहायक ने केस लिया, अपडेट जोड़ा, WhatsApp संदेश खुला
- [ ] परिवार ने भुगतान दर्ज किया, admin ने पक्का किया
- [ ] परिवार ने पुष्टि और रेटिंग दी, केस बंद हुआ
- [ ] एक तीसरे नंबर से लॉगिन करके देखा कि उसे किसी और का केस **नहीं** दिखता
