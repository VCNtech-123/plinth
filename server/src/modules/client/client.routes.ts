import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { createClient } from "./client.controller";
import { createClientSchema, getClientByIdSchema, getClientsSchema, updateClientSchema, deleteClientSchema } from "./client.validation";
import { getClients, getClientById, updateClient, deleteClient } from './client.controller'
import { validate } from "../../middleware/validate.middleware";

const router = Router();

router.post("/", protect, validate(createClientSchema), createClient);
router.get("/", protect, validate(getClientsSchema), getClients);
router.get("/:id", protect, validate(getClientByIdSchema), getClientById);
router.put("/:id", protect, validate(updateClientSchema), updateClient);
router.delete("/:id", protect, validate(deleteClientSchema), deleteClient);

export default router;