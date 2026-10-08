import { readFileSync } from "node:fs";
import { createDecipheriv } from "node:crypto";

const keyB64 = Bun.env.AOF_PACK_KEY_B64 || "";
if (!keyB64) throw new Error("AOF_PACK_KEY_B64 is required");

const parts = [1,2,3,4,5].map(i =>
  readFileSync(new URL(`./data/part${i}.txt`, import.meta.url), "utf8").trim()
).join("");

const blob = Buffer.from(parts, "base64");
const nonce = blob.subarray(0, 12);
const tag = blob.subarray(blob.length - 16);
const ciphertext = blob.subarray(12, blob.length - 16);
const decipher = createDecipheriv("aes-256-gcm", Buffer.from(keyB64, "base64"), nonce);
decipher.setAuthTag(tag);
const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
const bundle = JSON.parse(plain.toString("utf8"));

Bun.env.AOF_PACK_DATA_GZ_B64 = bundle.data_b64;
const serverPath = "/tmp/aof-v3-server.ts";
await Bun.write(serverPath, bundle.server_source);

const child = Bun.spawn(["bun", serverPath], {
  env: Bun.env,
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit"
});
const code = await child.exited;
if (code !== 0) throw new Error(`V3 server exited with code ${code}`);
