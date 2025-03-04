import { JwtPayload } from "./jwt-payload"

export {}

declare module 'express-serve-static-core' {
    export interface Request {
        user: JwtPayload
    }
}