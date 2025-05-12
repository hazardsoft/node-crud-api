import type {User, UserId} from "./types.js";
import {validate} from "uuid"

export const isUser = (body: User): body is User => {
  const validUsername = !!body.username && typeof body.username === 'string';
  const validAge = !!body.age && typeof body.age === 'number';
  const validHobbies = body.hobbies && Array.isArray(body.hobbies);
  return validUsername && validAge && validHobbies;
}

export const isUserId = (id: string): id is UserId => {
  return validate(id) && typeof id === 'string';
}