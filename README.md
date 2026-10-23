# Gaon Sahayak · गाँव सहायक

**गाँव का काम, अब शहर से।** Village work, now from the city.

Gaon Sahayak helps Biharis living outside Bihar get village problems solved without travelling home. A family posts the problem (land encroachment, pending mutation, land survey paperwork, certificates, pensions), a verified local helper called a *Sahayak* visits the right office on their behalf, and every step is logged with photos, receipt numbers and next dates.

The pilot starts in Darbhanga district (Ghanshyampur, Biraul and one more block).

## What's in this repository

| Path | What it is |
| --- | --- |
| `index.html` | Public website. Hindi by default, with a हिंदी / English switch. Add `#en` to the URL to open it in English. |
| `app.html` | App prototype with three views: **Family** (post and track a case), **Sahayak** (accept cases, log visits), **Admin** (verify Sahayaks, assign cases, see totals). |

Both are single HTML files with no build step.

## Running it

Open `index.html` in a browser, or turn on **GitHub Pages** (Settings → Pages → Deploy from branch → `main` / root). The site will then be live at `https://<your-username>.github.io/gaon-sahayak/`.

### Note about the app

Outside claude.ai the app runs in **demo mode**: it loads sample cases and everything works on screen, but nothing is saved after a page reload. The saved, shared version currently runs as a claude.ai artifact. A production app needs its own backend (for example Firebase or Supabase), phone OTP login and UPI payments, which are planned for phase 2.

## How a case works

1. Family posts the problem with village, block and khata/khesra number.
2. A verified Sahayak from that block accepts it; the family signs a one-case authorisation letter and pays 50% of the fee.
3. The Sahayak files applications in the family's name and follows up at the circle or block office.
4. If the office does not act, the Sahayak escalates through a Lok Shikayat complaint (hearing and decision within 60 working days), an RTI, or a partner advocate.
5. When it's done, the family confirms and rates the Sahayak, and the remaining 50% is released.

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
