import type { NextFunction, Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "@/core/errors/custom.error";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import {
  loginUsecase,
  logoutUsecase,
  registerUsecase,
  sessionUsecase,
} from "@/core/dependency_injection/auth.di";

export class AuthController {
  async onLoginController(req: Request, res: Response, next: NextFunction) {
    try {
      const validate = loginSchema.safeParse({
        ...req.body,
      });

      if (!validate.success) {
        throw new BadRequestError(validate.error.issues[0].message);
      }

      const result = await loginUsecase.execute(validate.data);
      req.session.user = { id_user: result.id_user };

      // Save session before sending response
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          next(err);
          return;
        }
        res.json(result);
      });
    } catch (error) {
      next(error);
    }
  }

  async onRegisterController(req: Request, res: Response, next: NextFunction) {
    try {
      const validate = registerSchema.safeParse({
        ...req.body,
      });

      if (!validate.success) {
        throw new BadRequestError(validate.error.issues[0].message);
      }

      const result = await registerUsecase.execute(validate.data);
      req.session.user = { id_user: result.id_user };

      // Save session before sending response
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          next(err);
          return;
        }
        res.json(result);
      });
    } catch (error) {
      next(error);
    }
  }

  async onSessionController(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.sessionID === null || req.sessionID === undefined) {
        req.session.destroy(() => {});
        throw new UnauthorizedError("Not authorized");
      }
      const result = await sessionUsecase.execute(req.sessionID);

      if (result === null || result === undefined) {
        req.session.destroy(() => {});
        throw new UnauthorizedError("Not authorized");
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async onLogoutController(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.sessionID === null || req.sessionID === undefined) {
        req.session.destroy(() => {});
        throw new UnauthorizedError("Not authorized");
      }

      const result = await logoutUsecase.execute(req.sessionID);

      if (result === null || result === undefined) {
        req.session.destroy(() => {});
        throw new UnauthorizedError("Not authorized");
      }

      // Destroy session after logout
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destroy error:", err);
        }
        res.json(result);
      });
    } catch (error) {
      next(error);
    }
  }
}
