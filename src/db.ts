import {UserId, UserWithId} from "./types.js";

export class Database {
    private users: UserWithId[] = [];

    public getAllUsers():UserWithId[] {
        return this.users.slice();
    }

    public getUserById(id:UserId):UserWithId | undefined {
        return this.users.find(user => user.id === id)
    }
}

export const db = new Database();