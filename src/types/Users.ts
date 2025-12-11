export interface User {
    _id: string;
    username: string;
    password: string;
    displayName: string;
}

export type Users = User[];