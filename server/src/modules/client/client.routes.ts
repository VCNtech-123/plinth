import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { createClient } from "./client.controller";
import { createClientSchema, getClientByIdSchema, getClientsSchema } from "./client.validation";
import { getClients, getClientById, updateClient, deleteClient } from './client.controller'
import { validate } from "../../middleware/validate.middleware";

const router = Router();

router.post("/", protect, validate(createClientSchema), createClient);
router.get("/", protect, validate(getClientsSchema), getClients);
router.get("/:id", protect, validate(getClientByIdSchema), getClientById);
router.put("/:id", protect, updateClient);
router.delete("/:id", protect, deleteClient);

export default router;