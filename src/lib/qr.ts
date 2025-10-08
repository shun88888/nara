import * as Crypto from 'expo-crypto';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';

const SERVER_SECRET = 'dev-secret'; // replace via env in real server

export type QRPayload = { booking_id: string; exp: number; nonce: string };

function b64url(input: string) {
  return input.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function utf8ToBase64(str: string): string {
  return Base64.stringify(Utf8.parse(str));
}

function base64ToUtf8(b64: string): string {
  return Utf8.stringify(Base64.parse(b64));
}

export function signToken(p: QRPayload): string {
  const payload = b64url(utf8ToBase64(JSON.stringify(p)));
  const sig = b64url(Base64.stringify(HmacSHA256(payload, SERVER_SECRET)));
  return `${payload}.${sig}`;
}

export function verifyToken(token: string): { ok: boolean; payload?: QRPayload; error?: string } {
  const [payloadB64, sig] = token.split('.');
  if (!payloadB64 || !sig) return { ok: false, error: 'MALFORMED' };
  const expected = b64url(Base64.stringify(HmacSHA256(payloadB64, SERVER_SECRET)));
  if (expected !== sig) return { ok: false, error: 'BAD_SIG' };
  const json = base64ToUtf8(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
  const payload = JSON.parse(json) as QRPayload;
  if (payload.exp * 1000 < Date.now()) return { ok: false, error: 'EXPIRED' };
  return { ok: true, payload };
}

export function generateQR(bookingId: string, ttlSec = 600): string {
  const payload: QRPayload = { booking_id: bookingId, exp: Math.floor(Date.now() / 1000) + ttlSec, nonce: Crypto.randomUUID() };
  return signToken(payload);
}


