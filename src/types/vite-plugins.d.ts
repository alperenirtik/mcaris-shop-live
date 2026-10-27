declare module"@vitejs/plugin-react" {
  import type { PluginOption } from"vite";

  export interface Options {
    jsxImportSource?: string;
    tsDecorators?: boolean;
    plugins?: [string, Record<string, unknown>][];
    babel?: Record<string, unknown>;
  }

  export default function react(options?: Options): PluginOption[];
}
