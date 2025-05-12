import type http from "node:http";

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