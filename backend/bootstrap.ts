const parts=[1,2,3,4,5].map(i=>Bun.env[`AOF_PACK_DATA_GZ_B64_${i}`]||"");
const joined=parts.join("");
if(joined) Bun.env.AOF_PACK_DATA_GZ_B64=joined;
if(!Bun.env.AOF_PACK_DATA_GZ_B64) throw new Error("Private pack data is not configured");
await import("./server.ts");
