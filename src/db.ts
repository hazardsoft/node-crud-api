import type {User, UserId, UserWithId} from "./types.js";
import {v4} from 'uuid';

export class Database {
    private users: UserWithId[] = [];

    public getAllUsers():UserWithId[] {
        return this.users.slice();
    }

    public getUserById(id:UserId):UserWithId | undefined {
        return this.users.find(user => user.id === id)
    }

    public createUser(body:User):UserWithId {
        const createdUser = {id: v4(), ...body};
        this.users.push(createdUser);
        return createdUser;
    }
}

export const db = new Database();