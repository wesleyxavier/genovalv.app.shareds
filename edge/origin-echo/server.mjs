// Origem de teste da borda: devolve os headers recebidos e conta requisicoes (rotas /__* nao contam).
import http from 'node:http';

let count = 0;

const json = (res, body, status = 200) => {
  res.writeHead(status, { 'content-type': 'application/json', 'cache-control': 'no-store' });
  res.end(JSON.stringify(body));
};

http
  .createServer((req, res) => {
    const { pathname } = new URL(req.url ?? '/', 'http://echo');

    if (pathname === '/__health') return void res.end('ok');
    if (pathname === '/__budget') return void json(res, { ok: true });
    if (pathname === '/__count') return json(res, { count });
    if (pathname === '/__reset') {
      count = 0;
      return json(res, { count });
    }

    count += 1;

    if (pathname.startsWith('/static/') && pathname.endsWith('.js')) {
      res.writeHead(200, {
        'content-type': 'application/javascript',
        'cache-control': 'public, max-age=60',
      });
      return void res.end(`console.log(${JSON.stringify(pathname)});`);
    }

    return json(res, { method: req.method, url: req.url, headers: req.headers });
  })
  .listen(8080, '0.0.0.0');
