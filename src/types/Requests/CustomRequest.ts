import { Request, Response } from "express";

export interface CustomRequest<T> extends Request {
  body: T;
}

type Send<ResBody = any, T = Response<ResBody>> = (body?: ResBody) => T;

export interface CustomResponse<T> extends Response {
  json: Send<T, this>;
}
