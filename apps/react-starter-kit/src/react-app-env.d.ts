/// <reference types="vite/client" />
declare module "*.md";

// https://vitejs.dev/guide/env-and-mode
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ImportMetaEnv {}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
