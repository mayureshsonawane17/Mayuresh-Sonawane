import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createApiRouter } from './server/api.js';

// Dedicated Express app to decorate raw Node Connect req/res with full Express API
const apiApp = express();
apiApp.use(cors());
apiApp.use(cookieParser());
apiApp.use(express.json());
apiApp.use('/', createApiRouter());

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-and-security-middleware',
      configureServer(server) {
        // SECURITY GATEWAY: Block direct access to internal database and server files
        server.middlewares.use((req, res, next) => {
          const url = req.url || '';
          if (
            url.startsWith('/data/') || 
            url.includes('/data/') ||
            url.startsWith('/server/') ||
            url.includes('/server/') ||
            url.includes('auth-db.json') ||
            url.includes('projects-db.json')
          ) {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Access denied. Database and server files are private.' }));
            return;
          }
          next();
        });

        // Mount API router through Express handler
        server.middlewares.use('/api', (req, res, next) => {
          apiApp(req, res, next);
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url || '';
          if (
            url.startsWith('/data/') || 
            url.includes('/data/') ||
            url.startsWith('/server/') ||
            url.includes('/server/') ||
            url.includes('auth-db.json') ||
            url.includes('projects-db.json')
          ) {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Access denied. Database and server files are private.' }));
            return;
          }
          next();
        });

        server.middlewares.use('/api', (req, res, next) => {
          apiApp(req, res, next);
        });
      },
    },
  ],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-three': ['three'],
          'vendor-gsap': ['gsap'],
          'vendor-lenis': ['lenis'],
          'vendor-react': ['react', 'react-dom'],
        },
      },
    },
  },
});
