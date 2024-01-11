import { Request } from "express";

export interface IRequestWithId extends Request {
    user_id?: number;
}
