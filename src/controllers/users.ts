import type http from "node:http";
import {isUser, isUserId} from "../validate";
import {getReqBody, getUserIdFromUrl} from "../utils";
import type {User} from "../types";
import {db} from "../db";

const sendError = (status: number, message: string, res: http.ServerResponse) => {
    res.writeHead(status);
    res.end(JSON.stringify({ message }));
};

const sendInvalidUserBody = (res: http.ServerResponse) => {
    sendError(400, "user body is invalid", res);
};

const sendUserNotFound = (userId: string, res: http.ServerResponse) => {
    sendError(404, `user ${userId} not found`, res);
};

const getValidUserId = (path: string, res: http.ServerResponse): string | null => {
    const userId = getUserIdFromUrl(path);
    if (!isUserId(userId)) {
        sendError(400, "user id is invalid", res);
        return null;
    }
    return userId;
};

export const handleUsers = async (path: string, req: http.IncomingMessage, res: http.ServerResponse) => {
   
    switch (req.method?.toUpperCase()) {
        case "GET":
            if (path === "/api/users") {
                const allUsers = db.getAllUsers();
                res.writeHead(200);
                res.end(JSON.stringify(allUsers));
            } else {
                const userId = getValidUserId(path, res);
                if (!userId) return;
                const user = db.getUserById(userId);
                if (user) {
                    res.writeHead(200);
                    res.end(JSON.stringify(user));
                } else {
                    sendUserNotFound(userId, res);
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
                sendInvalidUserBody(res);
            }
            break;
        }
        case "PUT": {
            const userId = getValidUserId(path, res);
            if (!userId) return;
            const userBody = await getReqBody<User>(req);
            if (isUser(userBody)) {
                const updatedUser = db.updateUser(userId, userBody);
                if (updatedUser) {
                    res.writeHead(200);
                    res.end(JSON.stringify(updatedUser));
                } else {
                    sendUserNotFound(userId, res);
                }
            } else {
                sendInvalidUserBody(res);
            }
            break;
        }
        case "DELETE": {
            const userId = getValidUserId(path, res);
            if (!userId) return;
            const deletedUser = db.deleteUser(userId);
            if (deletedUser) {
                res.writeHead(204);
                res.end();
            } else {
                sendUserNotFound(userId, res);
            }
            break;
        }
        default:
            res.writeHead(405);
            res.end(JSON.stringify({
                message: `unsupported method ${req.method}`
            }));
    }
}