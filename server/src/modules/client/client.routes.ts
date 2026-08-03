import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { createClient } from "./client.controller";
import { createClientSchema, getClientByIdSchema, getClientsSchema, updateClientSchema, deleteClientSchema, restoreClientSchema } from "./client.validation";
import { getClients, getClientById, updateClient, deleteClient, restoreClient } from './client.controller'
import { validate } from "../../middleware/validate.middleware";

const router = Router();

router.post("/", protect, validate(createClientSchema), createClient);
router.get("/", protect, validate(getClientsSchema), getClients);
router.get("/:id", protect, validate(getClientByIdSchema), getClientById);
router.put("/:id", protect, validate(updateClientSchema), updateClient);
router.delete("/:id", protect, validate(deleteClientSchema), deleteClient);
router.patch("/:id/restore", protect, validate(restoreClientSchema), restoreClient)

export default router;