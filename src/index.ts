import http from "node:http";
import url from "node:url";

const port = process.env.PORT || 4000;

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url ?? "", false);
  const path = parsedUrl.pathname;

  console.log(`received request: ${req.method} ${path}`)

  if (path?.startsWith("/api/users")) {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 200,
      message: 'Ok'
    }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({
      status: 404,
      message: `endpoint ${path} is not found`
    }));
  }
})

server.listen(port, () => {
  console.log(`server is running at port ${port}`)
});
