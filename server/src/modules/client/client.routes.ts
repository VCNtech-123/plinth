import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { createClient } from "./client.controller";
import { createClientSchema, getClientByIdSchema, getClientsSchema, updateClientSchema, deleteClientSchema, restoreClientSchema } from "./client.validation";
import { getClients, getClientById, updateClient, deleteClient, restoreClient } from './client.controller'
import { validate } from "../../middleware/validate.middleware";
import { attachWorkspace } from "../../middleware/workspace.middleware";
import { authorize } from "../../middleware/authorize.middleware";

const router = Router();

router.use(protect, attachWorkspace)
router.post("/", validate(createClientSchema), authorize("owner", "admin", "member"),createClient);
router.get("/", validate(getClientsSchema), getClients);
router.get("/:id", validate(getClientByIdSchema), getClientById);
router.put("/:id", validate(updateClientSchema), authorize("owner", "admin"), updateClient);
router.delete("/:id", validate(deleteClientSchema), authorize("owner"), deleteClient);
router.patch("/:id/restore", validate(restoreClientSchema), authorize("owner"), restoreClient)

export default router;