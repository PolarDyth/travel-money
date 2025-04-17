import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY = Buffer.from(process.env.AES_KEY!, "hex"); // 32 bytes in hex
const IV_LENGTH = 12; // recommended for GCM

export function encrypt(plainText: string) {
  // 1) Generate a fresh IV
  const iv = crypto.randomBytes(IV_LENGTH);

  // 2) Create cipher
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  // 3) Encrypt
  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);

  // 4) Get the auth tag
  const tag = cipher.getAuthTag();

  // 5) Return all pieces in hex (or base64)
  return {
    iv: iv.toString("hex"),
    tag: tag.toString("hex"),
    data: encrypted.toString("hex"),
  };
}

export function decrypt(encrypted: {
  iv: string;
  tag: string;
  data: string;
}) {
  const iv = Buffer.from(encrypted.iv, "hex");
  const tag = Buffer.from(encrypted.tag, "hex");
  const data = Buffer.from(encrypted.data, "hex");

  // 1) Create decipher
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);

  // 2) Set the auth tag
  decipher.setAuthTag(tag);

  // 3) Decrypt
  const decrypted = Buffer.concat([
    decipher.update(data),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

export function encryptToString(plainText: string) {
  const encrypted = encrypt(plainText); // your existing encrypt function
  // Serialize as JSON and encode as base64
  return Buffer.from(JSON.stringify(encrypted)).toString("base64");
}

export function decryptFromString(encryptedString: string) {
  const encrypted = JSON.parse(Buffer.from(encryptedString, "base64").toString("utf8"));
  return decrypt(encrypted);
}