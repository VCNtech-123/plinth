import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { createClient } from "./client.controller";
import { validateCreateClient, getClientByIdSchema } from "./client.validation";
import { getClients, getClientById, updateClient, deleteClient } from './client.controller'
import { validate } from "../../middleware/validate.middleware";

const router = Router();

router.post("/", protect, validateCreateClient, createClient);
router.get("/", protect, getClients);
router.get("/:id", protect, validate(getClientByIdSchema),getClientById);
router.put("/:id", protect, updateClient);
router.delete("/:id", protect, deleteClient);

export default router;