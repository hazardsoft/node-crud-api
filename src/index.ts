import http from "node:http";
import url from "node:url";

const port = 4000;

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url ?? "", false);
  const path = parsedUrl.pathname;

  console.log(`received request: ${req.method} ${path}`)

  res.writeHead(200);
  res.end(JSON.stringify({
    status: 200,
    message: 'Ok'
  }));
})

server.listen(port, () => {
  console.log(`server is running at port ${port}`)
});
