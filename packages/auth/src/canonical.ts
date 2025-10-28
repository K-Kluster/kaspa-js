import type { SiwkFields } from "./types";

export function canonicalSiwkString(f: SiwkFields): string {
  const lines: string[] = [];

  lines.push(`${f.domain} wants you to sign in with your Kaspa address:`);
  lines.push(f.address);
  lines.push("");

  if (f.statement?.trim()?.length) {
    lines.push(f.statement.trim());
    lines.push("");
  }

  lines.push(`URI: ${f.uri}`);
  lines.push(`Version: ${f.version}`);
  lines.push(`Chain ID: ${f.chainId}`);
  lines.push(`Nonce: ${f.nonce}`);
  lines.push(`Issued At: ${f.issuedAt}`);

  if (f.expirationTime) lines.push(`Expiration Time: ${f.expirationTime}`);
  if (f.notBefore) lines.push(`Not Before: ${f.notBefore}`);
  if (f.requestId) lines.push(`Request ID: ${f.requestId}`);

  if (f.resources?.length) {
    lines.push("Resources:");
    for (const r of f.resources) lines.push(`- ${r}`);
  }

  return lines.join("\n");
}
