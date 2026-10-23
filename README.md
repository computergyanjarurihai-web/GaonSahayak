# Gram Sahayak · ग्राम सहायक

**गाँव का काम, अब शहर से।** Village work, now from the city.

Gram Sahayak helps Biharis living outside Bihar get village problems solved without travelling home. A family posts the problem (land encroachment, pending mutation, land survey paperwork, certificates, pensions), a verified local helper called a *Sahayak* visits the right office on their behalf, and every step is logged with photos, receipt numbers and next dates.

The pilot starts in Darbhanga district (Ghanshyampur, Biraul and one more block).

## What's in this repository

| Path | What it is |
| --- | --- |
| `index.html` | Public website. Hindi by default, with a हिंदी / English switch. Add `#en` to the URL to open it in English. |
| `app.html` | The app, Hindi first with an English switch. Mobile OTP login; families post cases with photos/PDFs, pay by UPI and see only their own cases; Sahayaks accept cases, log visits with receipts and send WhatsApp updates; Admin approves Sahayaks, assigns cases and confirms payments. |
| `locations.js` | Location data for the dropdowns: all 38 Bihar districts listed. Darbhanga: subdivision → block → panchayat (309) with village suggestions. Madhubani, Sitamarhi, Muzaffarpur, Samastipur, Saharsa, Begusarai, Purnia, Katihar: block → panchayat (132 blocks, 2,132 panchayats). |
| `firestore.rules`, `storage.rules` | Firebase security rules: each family sees only its own cases, files and phone number. |
| `SETUP.md` | Step-by-step setup guide in Hindi: Firebase, UPI, Razorpay, WhatsApp. |

Both pages are single HTML files with no build step.

## Running it

Open `index.html` in a browser, or turn on **GitHub Pages** (Settings → Pages → Deploy from branch → `main` / root). The site will then be live at `https://<your-username>.github.io/<repo-name>/`.

### Demo mode vs live mode

Until a Firebase config is pasted into `CONFIG` at the top of `app.html`, the app runs in **demo mode**: any 10-digit number logs in with OTP `123456`, sample cases load, and nothing is saved. Follow `SETUP.md` to switch it to live mode.

## How a case works

1. Family posts the problem with district, block, panchayat, village and khata/khesra number, and pays the full fee by UPI.
2. A verified Sahayak from that block accepts it; the family signs a one-case authorisation letter.
3. The Sahayak files applications in the family's name and follows up at the circle or block office.
4. If the office does not act, the Sahayak escalates through a Lok Shikayat complaint (hearing and decision within 60 working days), an RTI, or a partner advocate.
5. When it's done, the family confirms and rates the Sahayak. If the work cannot be done, the full fee is refunded.

## Pilot fees

| Service | Fee |
| --- | --- |
| Mutation, jamabandi correction, LPC | ₹1,499 |
| Land survey paperwork | ₹999 |
| Encroachment and measurement | ₹2,499 |
| Certificates (caste, income, residence) | ₹499 |
| Pension and scheme benefits | ₹499 |
| File status check or RTI | ₹299 |
| Village guardian plan | ₹999 / month |

The Sahayak keeps 70% of each fee. Government fees are charged at cost, with receipts.

## Roadmap

- **Pilot (months 1–6):** 3 blocks of Darbhanga, this prototype plus WhatsApp. Goal: 150 cases closed with a 4.2+ rating.
- **Grow (months 7–12):** all of Darbhanga plus 2 districts, Play Store app, 50 Sahayaks.
- **Scale (year 2 onward):** all 38 districts of Bihar, linked with a migrant connector app.
