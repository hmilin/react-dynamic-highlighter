import react from '@vitejs/plugin-react';
import path, { resolve } from 'path';
import { ConfigEnv, defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig((env: ConfigEnv) => ({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  resolve: {
    alias: [
      {
        find: 'react-dynamic-highlighter',
        replacement: path.resolve(__dirname, 'lib/highlighter'),
      },
    ],
  },
  build: {
    ...(env.mode === 'lib'
      ? {
          lib: {
            entry: resolve(__dirname, 'lib/highlighter.tsx'),
            name: 'Highlighter',
            fileName: 'index',
            formats: ['es', 'umd'],
          },
          rollupOptions: {
            external: ['react', 'typescript'],
            output: {
              globals: {
                react: 'React',
                'react-dom': 'ReactDOM',
              },
            },
          },
        }
      : {}),
  },
}));
