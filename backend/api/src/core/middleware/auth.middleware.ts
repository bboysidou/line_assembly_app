import type { Request, Response, NextFunction, RequestHandler } from "express";
import "dotenv/config";

const authMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    if (!req.session.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    next();
  } catch (err) {
    console.log(err);
    res
      .status(401)
      .json({ error: "Session is not valid", message: "Session expired" });
  }
};

export default authMiddleware;
