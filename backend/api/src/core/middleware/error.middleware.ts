import type {
  Request,
  Response,
  // NextFunction,
  ErrorRequestHandler,
  NextFunction,
} from "express";
import { CustomError } from "@/core/errors/custom.error";
import { pgErrorMessages } from "@/core/errors/pg.error";

const errorMiddleware: ErrorRequestHandler = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error("ERROR: -------------------------------------");
  console.error(`PATH: ${req.path}\n ERROR: ${err}`);
  console.error("ERROR: -------------------------------------");
  const pgErrorKey = Object.keys(pgErrorMessages).find((key) =>
    err.message.includes(key),
  );

  if (pgErrorKey) {
    res.status(400).json({
      message: pgErrorMessages[pgErrorKey],
    });
    return;
  }

  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  res.status(500).json({ message: "Internal Server Error" });
};

export default errorMiddleware;
