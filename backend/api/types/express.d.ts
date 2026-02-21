import type { Session } from "express-session";
import type { SessionPayload } from "./session.payload";

declare global {
  namespace Express {
    interface Request {
      user: SessionPayload;
    }
  }
}

declare module "express-session" {
  interface SessionData {
    user: SessionPayload;
  }
}
