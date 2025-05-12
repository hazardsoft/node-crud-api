import http from "node:http";
import url from "node:url";
import {handleUsers} from "./controllers/users.js";

const port = process.env.PORT || 4000;

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url ?? "", false);
  const path = parsedUrl.pathname ?? "";

  console.log(`received request: ${req.method} ${path}`)

  if (path.startsWith("/api/users")) {
    try {
      await handleUsers(path, req, res);
    } catch {
      res.writeHead(500);
      res.end(JSON.stringify({
        message: "Internal server error"
      }));
    }
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({
      message: `endpoint ${path} is not found`
    }));
  }
})

server.listen(port, () => {
  console.log(`server is running at port ${port}`)
});
