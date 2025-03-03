/* eslint-disable prettier/prettier */
// src/types/request-with-user.type.ts
import { Request } from "express";
import { User } from "src/modules/users/schemas/user.schema";

export interface RequestWithUser extends Request {
  user: User;
}
