import { config } from "dotenv";
import firebase from "firebase-admin";
import * as serviceAccount from "../.firebase/serviceAccount.json";

config();

const typedServiceAccount = serviceAccount as firebase.ServiceAccount;

try {
  if (firebase.apps.length === 0) {
    firebase.initializeApp({
      credential: firebase.credential.cert(typedServiceAccount),
    });
    console.log("app iniciada");
  }
} catch (error) {
  console.log("Error de firebase: ", error);
}

export const firebaseAuth = firebase.auth();
