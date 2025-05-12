import type {User} from "./types.js";

export const isUser = (body: User): body is User => {
  const validUsername = !!body.username && typeof body.username === 'string';
  const validAge = !!body.age && typeof body.age === 'number';
  const validHobbies = body.hobbies && Array.isArray(body.hobbies);
  return validUsername && validAge && validHobbies;
}