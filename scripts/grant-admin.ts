/**
 * Grant or revoke admin access.
 *   bun run admin:grant someone@example.com          # grant
 *   bun run admin:grant someone@example.com --revoke # revoke
 * The user must already have signed in once (or been created in Firebase Auth).
 * Reads FIREBASE_ADMIN_* from .env.local (Bun loads it automatically).
 */
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const [email, flag] = process.argv.slice(2);
if (!email) {
  console.error("Usage: bun run admin:grant <email> [--revoke]");
  process.exit(1);
}

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const revoke = flag === "--revoke";
const user = await getAuth().getUserByEmail(email);
await getAuth().setCustomUserClaims(user.uid, revoke ? { admin: false } : { admin: true });
const db = getFirestore();
if (revoke) await db.doc(`adminUsers/${user.uid}`).delete();
else await db.doc(`adminUsers/${user.uid}`).set({ uid: user.uid, email, role: "admin", createdAt: FieldValue.serverTimestamp() });
await db.collection("auditLogs").add({ actorUid: "cli", action: revoke ? "admin.revoke" : "admin.grant", target: user.uid, createdAt: FieldValue.serverTimestamp() });
console.log(`${revoke ? "Revoked" : "Granted"} admin for ${email} (${user.uid}). They must sign out and back in.`);
