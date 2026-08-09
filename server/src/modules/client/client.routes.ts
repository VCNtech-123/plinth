import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { createClient } from "./client.controller";
import { createClientSchema, getClientByIdSchema, getClientsSchema, updateClientSchema, deleteClientSchema, restoreClientSchema } from "./client.validation";
import { getClients, getClientById, updateClient, deleteClient, restoreClient } from './client.controller'
import { validate } from "../../middleware/validate.middleware";
import { attachWorkspace } from "../../middleware/workspace.middleware";

const router = Router();

router.use(protect, attachWorkspace)
router.post("/", validate(createClientSchema), createClient);
router.get("/", validate(getClientsSchema), getClients);
router.get("/:id", validate(getClientByIdSchema), getClientById);
router.put("/:id", validate(updateClientSchema), updateClient);
router.delete("/:id", validate(deleteClientSchema), deleteClient);
router.patch("/:id/restore", validate(restoreClientSchema), restoreClient)

export default router;