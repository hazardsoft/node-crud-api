import cluster from 'node:cluster';
import os from 'node:os';
import http from 'node:http';

const numCPUs = os.availableParallelism();
const basePort = Number(process.env.PORT) || 4000;

if (cluster.isPrimary) {
  for (let i = 1; i < numCPUs; i++) {
    cluster.fork({ PORT: (basePort + i).toString() });
  }
  let current = 1;
  const workerPorts = Array.from({ length: numCPUs - 1 }, (_, i) => basePort + i + 1);

  const server = http.createServer((req, res) => {
    const targetPort = workerPorts[current % workerPorts.length];
    current++;
    const proxy = http.request({
      hostname: '127.0.0.1',
      port: targetPort,
      path: req.url,
      method: req.method,
      headers: req.headers,
    }, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });
    req.pipe(proxy, { end: true });
    proxy.on('error', (err) => {
      res.writeHead(502);
      res.end(JSON.stringify({ message: 'Proxy error', error: err.message }));
    });
  });

  server.listen(basePort, () => {
    console.log(`Load balancer listening on port ${basePort}`);
    console.log(`Worker ports: ${workerPorts.join(', ')}`);
  });
} else {
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
    process.env.PORT = process.env.PORT || (basePort + cluster.worker!.id).toString();
  await import('./index');
} 