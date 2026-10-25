import { Readable } from 'node:stream';
import { loadEnv } from 'vite';
import { createEnquiryHandler } from './enquiries.js';

// Run the same handler behind npm run dev, with server-only .env values.
export function enquiriesPlugin() {
  return {
    name: 'foresight-enquiries',
    configureServer(server) {
      const handle = createEnquiryHandler({ env: { ...loadEnv(server.config.mode, server.config.root, ''), ...process.env } });
      server.middlewares.use('/api/enquiries', async (req, res) => {
        try {
          const request = new Request(`http://${req.headers.host}/api/enquiries`, {
            method: req.method, headers: req.headers,
            ...(!['GET','HEAD'].includes(req.method) ? { body: Readable.toWeb(req), duplex: 'half' } : {}),
          });
          const response = await handle(request);
          res.writeHead(response.status, Object.fromEntries(response.headers));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch { res.writeHead(500, { 'Content-Type': 'application/json' }); res.end('{"sent":false}'); }
      });
    },
  };
}
