/// <reference types="vitest" />
import { resolve } from 'node:path';
import { defineConfig, type UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import ViteYaml from '@modyfi/vite-plugin-yaml';
import distDirs from './dist-dirs.json' with { type: 'json' };
import { getAliases, getClientEnvironmentVariables, getSelfDirectoryAbsolutePath } from './vite-config-helper';

const WEB_DIRECTORY = resolve(getSelfDirectoryAbsolutePath(), 'src/presentation');
const TEST_INITIALIZATION_FILE = resolve(getSelfDirectoryAbsolutePath(), 'tests/shared/bootstrap/setup.ts');

export function createVueConfig(options?: {
  readonly supportLegacyBrowsers: boolean,
}): UserConfig {
  return {
    root: WEB_DIRECTORY,
    build: {
      outDir: resolve(getSelfDirectoryAbsolutePath(), distDirs.web),
    },
    plugins: [
      vue(),
      ViteYaml(),
      ...[options?.supportLegacyBrowsers ? legacy() : undefined],
    ],
    esbuild: {
      supported: {
        'top-level-await': true, // Exclude browsers not supporting top-level-await
      },
    },
    define: {
      ...getClientEnvironmentVariables(),
    },
    resolve: {
      alias: {
        ...getAliases(),
      },
    },
    server: {
      port: 3169,
    },
    css: {
      preprocessorOptions: {
        scss: {
          // The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0.
          // Vite defaults compiler to 'legacy', see https://vite.dev/config/shared-options#css-preprocessoroptions
          api: 'modern-compiler',
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      alias: {
        ...getAliases(),
      },
      setupFiles: [
        TEST_INITIALIZATION_FILE,
      ],
    },
  };
}

export default defineConfig(createVueConfig({
  supportLegacyBrowsers: true,
}));
