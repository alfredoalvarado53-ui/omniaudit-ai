/**
 * OmniAudit AI — Firebase & App Check Configuration Template
 * 
 * Instructions:
 * 1. Copy this file and rename it to `firebase-config.js` (this file is excluded from Git).
 * 2. Fill in your genuine Firebase project credentials from the Firebase Console (Project Settings > General > Your apps).
 * 3. Ensure the 'Vertex AI in Firebase' API is enabled in your Google Cloud / Firebase Console.
 * 4. Configure App Check (reCAPTCHA Enterprise or debug token for local development).
 */

export const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export const appCheckConfig = {
  // Optional: reCAPTCHA Enterprise or v3 site key for production web attestation
  recaptchaSiteKey: "",

  // Set to true during local development (localhost / 127.0.0.1)
  // When enabled, Firebase generates a debug token in your browser DevTools console.
  // Register that debug token in Firebase Console > App Check > Apps > Manage debug tokens.
  isLocalDebug: true
};
