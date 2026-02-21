// clients.controller.ts
import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "@/core/errors/custom.error";
import {
  createClientSchema,
  updateClientSchema,
  deleteClientSchema,
} from "../schemas/client.schema";
import {
  createClientUsecase,
  getAllClientsUsecase,
  getClientByIdUsecase,
  updateClientUsecase,
  deleteClientUsecase,
} from "@/core/dependency_injection/clients.di";

export class ClientsController {
  // GET all clients
  async onGetAllClientsController(
    _: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await getAllClientsUsecase.execute();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // GET client by ID
  async onGetClientByIdController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await getClientByIdUsecase.execute(req.params.id_client);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // POST create client
  async onCreateClientController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validate = createClientSchema.safeParse(req.body);

      if (!validate.success) {
        throw new BadRequestError(validate.error.issues[0].message);
      }

      const result = await createClientUsecase.execute(validate.data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // PATCH update client
  async onUpdateClientController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validate = updateClientSchema.safeParse({
        ...req.body,
        id_client: req.params.id_client,
      });

      if (!validate.success) {
        throw new BadRequestError(validate.error.issues[0].message);
      }

      const result = await updateClientUsecase.execute(validate.data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // DELETE client
  async onDeleteClientController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validate = deleteClientSchema.safeParse({
        id_client: req.params.id_client,
      });

      if (!validate.success) {
        throw new BadRequestError(validate.error.issues[0].message);
      }

      await deleteClientUsecase.execute(validate.data.id_client);
      res.json({ message: "Client deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
