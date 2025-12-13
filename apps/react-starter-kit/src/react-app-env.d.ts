/// <reference types="vite/client" />
declare module "*.md";

// https://vitejs.dev/guide/env-and-mode
interface ImportMetaEnv {}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
