import init, { initConsolePanicHook } from "@kluster/kaspa-wasm-web";

const boot = async () => {
  await init();

  initConsolePanicHook();

  await (await import("./index")).startApplicationRendering();
};

boot();
