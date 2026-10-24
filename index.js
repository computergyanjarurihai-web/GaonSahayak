/*
 * Gram Sahayak — "vault": encrypts and decrypts personal fields.
 * Mobile numbers and khata/khesra are stored in Firestore as "enc:v1:..." and can be read
 * only through this service, which checks who is asking.
 *   seal    – any logged-in user: encrypt values before saving them
 *   reveal  – case: the family, its assigned Sahayak or an admin; user: the person or an admin
 *   migrate – admin: encrypt old plain-text data already in the database
 * The 32-byte key lives in Secret Manager and reaches this service as the FIELD_KEY env var.
 */
const crypto = require("crypto");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

const PREFIX = "enc:v1:";
const KEY = Buffer.from(process.env.FIELD_KEY || "", "base64");
const ORIGINS = (process.env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
const REQUIRE_APPCHECK = process.env.REQUIRE_APPCHECK === "true";

const isEnc = v => typeof v === "string" && v.startsWith(PREFIX);
function enc(plain){
  if (plain == null || plain === "" || isEnc(plain)) return plain;
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", KEY, iv);
  const ct = Buffer.concat([c.update(String(plain), "utf8"), c.final()]);
  return PREFIX + Buffer.concat([iv, c.getAuthTag(), ct]).toString("base64");
}
function dec(v){
  if (!isEnc(v)) return v;
  const b = Buffer.from(v.slice(PREFIX.length), "base64");
  const d = crypto.createDecipheriv("aes-256-gcm", KEY, b.subarray(0, 12));
  d.setAuthTag(b.subarray(12, 28));
  return Buffer.concat([d.update(b.subarray(28)), d.final()]).toString("utf8");
}

class HttpError extends Error { constructor(code, msg){ super(msg); this.code = code; } }
const role = async uid => { const u = await db.collection("users").doc(uid).get(); return u.exists ? u.data().role : null; };

async function seal(uid, body){
  const values = body.values || {};
  const keys = Object.keys(values);
  if (keys.length > 6) throw new HttpError(400, "too many fields");
  const out = {};
  for (const k of keys) {
    const v = values[k];
    if (v != null && (typeof v !== "string" || v.length > 300)) throw new HttpError(400, "bad value");
    out[k] = enc(v);
  }
  return { values: out };
}

async function reveal(uid, body){
  if (body.kind === "case") {
    const ref = db.collection("cases").doc(String(body.id || ""));
    const snap = await ref.get();
    if (!snap.exists) throw new HttpError(404, "not found");
    const c = snap.data();
    const ok = c.ownerUid === uid || c.sahayakUid === uid || (await role(uid)) === "admin";
    if (!ok) throw new HttpError(403, "not allowed");
    const p = await ref.collection("private").doc("contact").get();
    const pd = p.exists ? p.data() : {};
    return { values: { land: dec(c.land || ""), phone: dec(pd.phone || ""), name: pd.name || "" } };
  }
  if (body.kind === "user") {
    const id = String(body.id || "");
    if (id !== uid && (await role(uid)) !== "admin") throw new HttpError(403, "not allowed");
    const u = await db.collection("users").doc(id).get();
    if (!u.exists) throw new HttpError(404, "not found");
    return { values: { phone: dec(u.data().phone || "") } };
  }
  throw new HttpError(400, "bad kind");
}

async function migrate(uid){
  if ((await role(uid)) !== "admin") throw new HttpError(403, "admin only");
  let n = 0;
  const users = await db.collection("users").get();
  for (const d of users.docs) { const ph = d.data().phone; if (ph && !isEnc(ph)) { await d.ref.update({ phone: enc(ph) }); n++; } }
  const cases = await db.collection("cases").get();
  for (const d of cases.docs) {
    const c = d.data();
    if (c.land && !isEnc(c.land)) { await d.ref.update({ land: enc(c.land) }); n++; }
    const p = await d.ref.collection("private").doc("contact").get();
    if (p.exists && p.data().phone && !isEnc(p.data().phone)) { await p.ref.update({ phone: enc(p.data().phone) }); n++; }
  }
  return { encrypted: n };
}

exports.vault = async (req, res) => {
  const origin = req.get("origin") || "";
  if (ORIGINS.includes(origin)) { res.set("Access-Control-Allow-Origin", origin); res.set("Vary", "Origin"); }
  res.set("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Firebase-AppCheck");
  res.set("Access-Control-Allow-Methods", "POST");
  if (req.method === "OPTIONS") return res.status(204).send("");
  try {
    if (KEY.length !== 32) throw new HttpError(500, "FIELD_KEY missing");
    if (req.method !== "POST") throw new HttpError(405, "POST only");
    if (ORIGINS.length && !ORIGINS.includes(origin)) throw new HttpError(403, "origin not allowed");
    const m = (req.get("authorization") || "").match(/^Bearer (.+)$/);
    if (!m) throw new HttpError(401, "login required");
    const user = await admin.auth().verifyIdToken(m[1]).catch(() => { throw new HttpError(401, "bad login token"); });
    if (REQUIRE_APPCHECK) {
      const t = req.get("x-firebase-appcheck");
      if (!t) throw new HttpError(401, "app check required");
      await admin.appCheck().verifyToken(t).catch(() => { throw new HttpError(401, "bad app check token"); });
    }
    const body = req.body || {};
    const out = body.action === "seal" ? await seal(user.uid, body)
      : body.action === "reveal" ? await reveal(user.uid, body)
      : body.action === "migrate" ? await migrate(user.uid)
      : (() => { throw new HttpError(400, "bad action"); })();
    res.status(200).json(out);
  } catch (e) {
    const code = e.code && Number.isInteger(e.code) ? e.code : 500;
    if (code === 500) console.error(e);
    res.status(code).json({ error: e.message || "error" });
  }
};
// exported for tests
exports._enc = enc; exports._dec = dec;
