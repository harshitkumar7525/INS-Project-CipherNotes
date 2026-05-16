import CryptoJS from "crypto-js";

/**
 * DES encryption utilities.
 * Key is loaded from env (DES_SECRET_KEY) and never sent to the client.
 */
const SECRET = process.env.DES_SECRET_KEY;

function getKey() {
  if (!SECRET) throw new Error("DES_SECRET_KEY is not defined in environment");
  return CryptoJS.enc.Utf8.parse(SECRET.slice(0, 8).padEnd(8, "0")); // DES uses 8-byte key
}

export function encryptDES(plaintext: string): string {
  const key = getKey();
  return CryptoJS.DES.encrypt(plaintext, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
}

export function decryptDES(ciphertext: string): string {
  const key = getKey();
  const bytes = CryptoJS.DES.decrypt(ciphertext, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return bytes.toString(CryptoJS.enc.Utf8);
}
