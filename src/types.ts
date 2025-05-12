export type Hobby = string;
export type UserId = string;

export interface User {
    username: string;
    age: number;
    hobbies: Hobby[]
}

export interface UserWithId extends User {
    id: UserId;
}