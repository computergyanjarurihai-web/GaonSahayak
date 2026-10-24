#!/usr/bin/env bash
# Gram Sahayak vault — Google Cloud Shell में चलाएँ:
#   gcloud config set project gramsahayak-579fa
#   git clone https://github.com/computergyanjarurihai-web/GaonSahayak.git && cd GaonSahayak/vault && bash deploy.sh
set -euo pipefail
PROJECT=$(gcloud config get-value project 2>/dev/null)
REGION=asia-south1
ORIGINS="https://computergyanjarurihai-web.github.io"
[ -n "$PROJECT" ] || { echo "पहले चलाएँ: gcloud config set project <project-id>"; exit 1; }
echo "प्रोजेक्ट: $PROJECT"

echo "1/4 ज़रूरी सेवाएँ चालू कर रहे हैं…"
gcloud services enable cloudfunctions.googleapis.com run.googleapis.com cloudbuild.googleapis.com \
  artifactregistry.googleapis.com secretmanager.googleapis.com firestore.googleapis.com >/dev/null

echo "2/4 एन्क्रिप्शन की चाबी (Secret Manager)…"
if gcloud secrets describe gs-field-key >/dev/null 2>&1; then
  echo "   चाबी पहले से है, वही इस्तेमाल होगी।"
else
  openssl rand -base64 32 | tr -d '\n' | gcloud secrets create gs-field-key \
    --replication-policy=user-managed --locations="$REGION" --data-file=- >/dev/null
  echo "   नई चाबी बनी। इसे कभी डिलीट न करें, वरना एन्क्रिप्टेड डेटा नहीं खुलेगा।"
fi

echo "3/4 अनुमतियाँ…"
PN=$(gcloud projects describe "$PROJECT" --format='value(projectNumber)')
SA="$PN-compute@developer.gserviceaccount.com"
gcloud secrets add-iam-policy-binding gs-field-key --member="serviceAccount:$SA" --role=roles/secretmanager.secretAccessor >/dev/null
for R in roles/datastore.user roles/cloudbuild.builds.builder roles/logging.logWriter roles/artifactregistry.writer; do
  gcloud projects add-iam-policy-binding "$PROJECT" --member="serviceAccount:$SA" --role="$R" --condition=None >/dev/null
done

echo "4/4 vault सर्वर बना रहे हैं (3–5 मिनट)…"
gcloud functions deploy gs-vault --gen2 --runtime=nodejs20 --region="$REGION" --source=. \
  --entry-point=vault --trigger-http --allow-unauthenticated \
  --set-secrets=FIELD_KEY=gs-field-key:1 --set-env-vars="ALLOWED_ORIGINS=$ORIGINS" \
  --memory=256Mi --max-instances=3 --quiet

URL=$(gcloud functions describe gs-vault --gen2 --region="$REGION" --format='value(serviceConfig.uri)')
echo
echo "✅ हो गया। यह पता app.html के CONFIG में vaultUrl में डालें:"
echo "   $URL"
