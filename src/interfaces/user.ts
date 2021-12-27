export interface User{
    id: string;
    login: string;
    password?: string;
    email?: string;
    name?: string;
    isActive?: boolean;
}
