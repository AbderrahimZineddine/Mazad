import { AuthToken } from "./auth-token";

export interface ApiResult<T = any> {
    message?: string;
    tokens?: AuthToken;
    pagination?: { page?: number; length?: number; next?: number; prev?: number };
    data?: T;

}