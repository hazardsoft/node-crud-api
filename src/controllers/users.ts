import {isUser, isUserId} from "../validate.js";
import type http from "node:http";
import {getReqBody} from "../utils.js";
import type {User} from "../types.js";
import {db} from "../db.js";

export const handleUsers = async (path:string, req:http.IncomingMessage, res:http.ServerResponse) => {
    switch (req.method?.toUpperCase()) {
        case "GET":
          if (path === "/api/users") {
            const allUsers = db.getAllUsers();
            res.writeHead(200);
            res.end(JSON.stringify(allUsers));
          } else {
            const userId = getUserId(path);
            if (!isUserId(userId)) {
              res.writeHead(400);
              res.end(JSON.stringify({
                message: "user id is invalid"
              }));
              return;
            }
            const user = db.getUserById(userId);
            if (user) {
              res.writeHead(200);
              res.end(JSON.stringify(user));
            } else {
              res.writeHead(404);
              res.end(JSON.stringify({
                message: `user ${userId} not found`
              }));
            }
          }
          break;
        case "POST": {
          const userBody = await getReqBody<User>(req);
          if (isUser(userBody)) {
            const createdUser = db.createUser(userBody);
            res.writeHead(201);
            res.end(JSON.stringify(createdUser));
          } else {
            res.writeHead(400);
            res.end(JSON.stringify({
              message: "user body is invalid"
            }));
          }
          break;
        }
        case "PUT": {
          const userId = getUserId(path);
          if (!isUserId(userId)) {
            res.writeHead(400);
            res.end(JSON.stringify({
              message: "user id is invalid"
            }));
            return;
          }
          const userBody = await getReqBody<User>(req);
          if (isUser(userBody)) {
            const updatedUser = db.updateUser(userId, userBody);
            if (updatedUser) {
              res.writeHead(200);
              res.end(JSON.stringify(updatedUser));
            } else {
              res.writeHead(404);
              res.end(JSON.stringify({
                message: `user ${userId} not found`
              }));
            }
          } else {
            res.writeHead(400);
            res.end(JSON.stringify({
              message: "user body is invalid"
            }));
          }
        }
        break;
        default:
          res.writeHead(200);
          res.end(JSON.stringify({
            message: `unsupported method ${req.method}`
          }));
      }
}

const getUserId = (path:string) => {
  return path.split('users')[1].replace("/", "");
}