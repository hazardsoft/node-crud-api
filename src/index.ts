import http from "node:http";

const port = 4000;

const server = http.createServer(async (req, res) => {
  console.log(`received request via ${req.method} method`);
  res.writeHead(200);
  res.end(JSON.stringify({
    status: 200,
    message: 'Ok'
  }));
})

server.listen(port, () => {
  console.log(`server is running at port ${port}`)
});
