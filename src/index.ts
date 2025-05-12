import http from "node:http";
import url from "node:url";
import {db} from "./db.js";

const port = process.env.PORT || 4000;

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url ?? "", false);
  const path = parsedUrl.pathname;

  console.log(`received request: ${req.method} ${path}`)

  if (path?.startsWith("/api/users")) {
    switch (req.method?.toUpperCase()) {
      case "GET":
        if (path === "/api/users") {
          const allUsers = db.getAllUsers();
          res.writeHead(200);
          res.end(JSON.stringify({
            users: allUsers
          }));
        } else {
          const userId = path.split('users')[1].replace("/", "");
          const user = db.getUserById(userId);
          if (user) {
            res.writeHead(200);
            res.end(JSON.stringify({
              user
            }));
          } else {
            res.writeHead(404);
            res.end(JSON.stringify({
              message: `user ${userId} not found`
            }));
          }
        }
        break;
      default:
        res.writeHead(200);
        res.end(JSON.stringify({
          message: `unsupported method ${req.method}`
        }));
        break;
    }
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
