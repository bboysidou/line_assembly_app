// clients.route.ts
import { Router } from "express";
import authMiddleware from "@/core/middleware/auth.middleware";
import { ClientsController } from "./controllers/clients.controller";

const router = Router();
const controller = new ClientsController();

// Public routes (no authentication required)
router.get("/", controller.onGetAllClientsController);
router.get("/:id_client", controller.onGetClientByIdController);

// Protected routes (require authentication)
router.post("/", authMiddleware, controller.onCreateClientController);
router.patch("/:id_client", authMiddleware, controller.onUpdateClientController);
router.delete("/:id_client", authMiddleware, controller.onDeleteClientController);

export { router as clientsRouter };
