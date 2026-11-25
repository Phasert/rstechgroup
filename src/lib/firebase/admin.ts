import "server-only";

import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

const hasCredentials = Boolean(projectId && clientEmail && privateKey);

/**
 * Local development against the Firebase Emulator Suite: when FIRESTORE_EMULATOR_HOST
 * is set the Admin SDK talks to the emulator and needs no service account.
 * Use a `demo-` project id so nothing can ever reach a real project.
 */
export const isUsingEmulator = !hasCredentials && Boolean(process.env.FIRESTORE_EMULATOR_HOST);
const emulatorProjectId = process.env.FIREBASE_EMULATOR_PROJECT_ID ?? "demo-rstechgroup";

export const isFirebaseAdminConfigured = hasCredentials || isUsingEmulator;

let app: App | undefined;

function adminApp(): App {
  if (!isFirebaseAdminConfigured) {
    throw new Error("Firebase Admin is not configured. Fill FIREBASE_ADMIN_* in .env.local.");
  }
  if (!app) {
    app =
      getApps()[0] ??
      (isUsingEmulator
        ? initializeApp({ projectId: emulatorProjectId })
        : initializeApp({
            credential: cert({ projectId, clientEmail, privateKey }),
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          }));
  }
  return app;
}

export const adminAuth = () => getAuth(adminApp());
export const adminDb = () => getFirestore(adminApp());
export const adminBucket = () => getStorage(adminApp()).bucket();
