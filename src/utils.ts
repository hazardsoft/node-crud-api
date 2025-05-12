import type http from "node:http";
import type {UserId} from "./types.js";

export const getReqBody = async <T>(req: http.IncomingMessage): Promise<T> => {
  return new Promise((resolve, reject) => {
    let bodyStr = "";
    req.on('data', (chunk) => {
      bodyStr += chunk.toString();
    });
    req.on('end', () => {
      try {
        const body = JSON.parse(bodyStr) as T;
        resolve(body);
      } catch (e) {
        reject(e)
      }
    })
    req.on('error', (error) => reject(error))
  })
}

export const getUserIdFromUrl = (path:string):UserId => {
  const match = path.match(/^\/api\/users\/([^/?]+)/);
  return match ? match[1] as UserId : '';
}