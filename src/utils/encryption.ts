const IP = [
  58,50,42,34,26,18,10,2, 60,52,44,36,28,20,12,4,
  62,54,46,38,30,22,14,6, 64,56,48,40,32,24,16,8,
  57,49,41,33,25,17, 9,1, 59,51,43,35,27,19,11,3,
  61,53,45,37,29,21,13,5, 63,55,47,39,31,23,15,7,
];

const IP_INV = [
  40,8,48,16,56,24,64,32, 39,7,47,15,55,23,63,31,
  38,6,46,14,54,22,62,30, 37,5,45,13,53,21,61,29,
  36,4,44,12,52,20,60,28, 35,3,43,11,51,19,59,27,
  34,2,42,10,50,18,58,26, 33,1,41, 9,49,17,57,25,
];

const PC1 = [
  57,49,41,33,25,17, 9, 1,58,50,42,34,26,18,
  10, 2,59,51,43,35,27,19,11, 3,60,52,44,36,
  63,55,47,39,31,23,15, 7,62,54,46,38,30,22,
  14, 6,61,53,45,37,29,21,13, 5,28,20,12, 4,
];

const PC2 = [
  14,17,11,24, 1, 5, 3,28,15, 6,21,10,
  23,19,12, 4,26, 8,16, 7,27,20,13, 2,
  41,52,31,37,47,55,30,40,51,45,33,48,
  44,49,39,56,34,53,46,42,50,36,29,32,
];

const E = [
  32, 1, 2, 3, 4, 5, 4, 5, 6, 7, 8, 9,
   8, 9,10,11,12,13,12,13,14,15,16,17,
  16,17,18,19,20,21,20,21,22,23,24,25,
  24,25,26,27,28,29,28,29,30,31,32, 1,
];

const P = [
  16, 7,20,21,29,12,28,17, 1,15,23,26, 5,18,31,10,
   2, 8,24,14,32,27, 3, 9,19,13,30, 6,22,11, 4,25,
];

const S: number[][][] = [
  [[14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7],[0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8],[4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0],[15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13]],
  [[15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10],[3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5],[0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15],[13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9]],
  [[10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8],[13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1],[13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7],[1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12]],
  [[7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15],[13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9],[10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4],[3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14]],
  [[2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9],[14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6],[4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14],[11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3]],
  [[12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11],[10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8],[9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6],[4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13]],
  [[4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1],[13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6],[1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2],[6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12]],
  [[13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7],[1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2],[7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8],[2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11]],
];

const KEY_SHIFTS = [1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1];


function toBitArray(bytes: Uint8Array): number[] {
  const bits: number[] = [];
  for (const byte of bytes)
    for (let i = 7; i >= 0; i--)
      bits.push((byte >> i) & 1);
  return bits;
}

function fromBitArray(bits: number[]): Uint8Array {
  const bytes = new Uint8Array(bits.length / 8);
  for (let i = 0; i < bytes.length; i++) {
    let val = 0;
    for (let j = 0; j < 8; j++) val = (val << 1) | bits[i * 8 + j];
    bytes[i] = val;
  }
  return bytes;
}

function permute(bits: number[], table: number[]): number[] {
  return table.map(pos => bits[pos - 1]);
}

function xor(a: number[], b: number[]): number[] {
  return a.map((v, i) => v ^ b[i]);
}

function rotateLeft(bits: number[], n: number): number[] {
  return [...bits.slice(n), ...bits.slice(0, n)];
}

function bitsToHex(bits: number[]): string {
  const bytes = fromBitArray(bits);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}

function generateSubkeys(keyBytes: Uint8Array): number[][] {
  const keyBits = toBitArray(keyBytes);
  const permuted = permute(keyBits, PC1);
  let C = permuted.slice(0, 28);
  let D = permuted.slice(28, 56);
  const subkeys: number[][] = [];
  for (let i = 0; i < 16; i++) {
    C = rotateLeft(C, KEY_SHIFTS[i]);
    D = rotateLeft(D, KEY_SHIFTS[i]);
    subkeys.push(permute([...C, ...D], PC2));
  }
  return subkeys;
}

function fFunction(R: number[], subkey: number[]): number[] {
  const expanded = permute(R, E);
  const xored = xor(expanded, subkey);
  const sOutput: number[] = [];
  for (let i = 0; i < 8; i++) {
    const chunk = xored.slice(i * 6, i * 6 + 6);
    const row = (chunk[0] << 1) | chunk[5];
    const col = (chunk[1] << 3) | (chunk[2] << 2) | (chunk[3] << 1) | chunk[4];
    const val = S[i][row][col];
    for (let j = 3; j >= 0; j--) sOutput.push((val >> j) & 1);
  }
  return permute(sOutput, P);
}

function logPlaintextConversion(plaintext: string): void {
  const bytes = Array.from(new TextEncoder().encode(plaintext));
  console.log("\n  ASCII -> Binary -> Hex");
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    console.log(
      `  '${plaintext[i]}'  dec=${String(b).padStart(3)}  bin=${b.toString(2).padStart(8, "0")}  hex=0x${b.toString(16).toUpperCase().padStart(2, "0")}`
    );
  }
  console.log(`  hex string: ${bytes.map(b => b.toString(16).toUpperCase().padStart(2, "0")).join("")}`);
}

function logCiphertextConversion(outputBytes: Uint8Array): void {
  const bytes = Array.from(outputBytes);
  console.log("\n  Hex -> Binary -> ASCII");
  for (const b of bytes) {
    const c = String.fromCharCode(b);
    const char = /[\x20-\x7E]/.test(c) ? `'${c}'` : `\\x${b.toString(16).padStart(2, "0")}`;
    console.log(
      `  0x${b.toString(16).toUpperCase().padStart(2, "0")}  bin=${b.toString(2).padStart(8, "0")}  dec=${String(b).padStart(3)}  char=${char}`
    );
  }
  console.log(`  ascii: ${bytes.map(b => String.fromCharCode(b)).join("")}`);
}

function desBlock(
  blockBytes: Uint8Array,
  subkeys: number[][],
  log: boolean
): Uint8Array {
  const bits = toBitArray(blockBytes);
  const ip = permute(bits, IP);
  let L = ip.slice(0, 32);
  let R = ip.slice(32, 64);

  if (log) {
    console.log(`\n  After IP:  ${bitsToHex([...L, ...R])}`);
  }

  for (let round = 0; round < 16; round++) {
    const newR = xor(L, fFunction(R, subkeys[round]));
    L = R;
    R = newR;
    if (log) {
      console.log(`  Round ${String(round + 1).padStart(2, " ")}: key used: ${bitsToHex(subkeys[round])}  LT=${bitsToHex(L)}  RT=${bitsToHex(R)}`);
    }
  }

  const preOutput = [...R, ...L];
  const output = permute(preOutput, IP_INV);
  return fromBitArray(output);
}


function pkcs7Pad(data: Uint8Array, blockSize = 8): Uint8Array {
  const padLen = blockSize - (data.length % blockSize);
  const padded = new Uint8Array(data.length + padLen);
  padded.set(data);
  padded.fill(padLen, data.length);
  return padded;
}

function pkcs7Unpad(data: Uint8Array): Uint8Array {
  const padLen = data[data.length - 1];
  return data.slice(0, data.length - padLen);
}


function parseKey(secret: string): Uint8Array {
  const encoder = new TextEncoder();
  const raw = encoder.encode(secret.slice(0, 8).padEnd(8, "0"));
  return raw;
}

export function encryptDES(plaintext: string, verbose = false): string {
  const secret = process.env.DES_SECRET_KEY;
  if (!secret) throw new Error("DES_SECRET_KEY is not defined");

  const keyBytes = parseKey(secret);
  const subkeys = generateSubkeys(keyBytes);

  const encoder = new TextEncoder();
  const data = pkcs7Pad(encoder.encode(plaintext));

  const blocks = data.length / 8;
  const outputBytes = new Uint8Array(data.length);

  if (verbose) {
    console.log(`\nEncrypting ${blocks} block(s)`);
    logPlaintextConversion(plaintext);
  }

  for (let b = 0; b < blocks; b++) {
    const block = data.slice(b * 8, b * 8 + 8);
    if (verbose) console.log(`\nBlock ${b + 1} plaintext:  ${bitsToHex(toBitArray(block))}`);
    const encrypted = desBlock(block, subkeys, verbose);
    outputBytes.set(encrypted, b * 8);
    if (verbose) console.log(`Block ${b + 1} ciphertext: ${bitsToHex(toBitArray(encrypted))}`);
  }

  return Array.from(outputBytes).map(b => b.toString(16).padStart(2, "0").toUpperCase()).join("");
}

export function decryptDES(ciphertext: string, verbose = false): string {
  const secret = process.env.DES_SECRET_KEY;
  if (!secret) throw new Error("DES_SECRET_KEY is not defined");

  const keyBytes = parseKey(secret);
  const subkeys = generateSubkeys(keyBytes).reverse();

  const data = new Uint8Array(ciphertext.length / 2);
  for (let i = 0; i < data.length; i++) data[i] = parseInt(ciphertext.slice(i * 2, i * 2 + 2), 16);

  const blocks = data.length / 8;
  const outputBytes = new Uint8Array(data.length);

  if (verbose) console.log(`\nDecrypting ${blocks} block(s)`);

  for (let b = 0; b < blocks; b++) {
    const block = data.slice(b * 8, b * 8 + 8);
    if (verbose) console.log(`\nBlock ${b + 1} ciphertext: ${bitsToHex(toBitArray(block))}`);
    const decrypted = desBlock(block, subkeys, verbose);
    outputBytes.set(decrypted, b * 8);
    if (verbose) console.log(`Block ${b + 1} plaintext:  ${bitsToHex(toBitArray(decrypted))}`);
  }

  const decoder = new TextDecoder();
  const result = decoder.decode(pkcs7Unpad(outputBytes));

  if (verbose) logCiphertextConversion(pkcs7Unpad(outputBytes));

  return result;
}