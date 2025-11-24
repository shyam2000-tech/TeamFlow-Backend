import { IUserTokenPayload } from "../modules/auth/type/interface";

export {};

declare global {
  namespace Express {
    interface Request {
      user?: IUserTokenPayload;
    }
  }
}
