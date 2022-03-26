import { Request } from "express";

export interface CustomRequest<T> extends Request {
  body: T;
}

export interface ErrorResponse {
  message: string;
  errorCode: string;
}
