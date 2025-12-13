"use client";

import init, * as wasmModule from "./kaspa";
import type * as KaspaWasm from "./kaspa";

export type KaspaWasmExports = typeof KaspaWasm;

export async function initWasm(): Promise<KaspaWasmExports> {
  await init("/kaspa_bg.wasm");
  return wasmModule as KaspaWasmExports;
}
