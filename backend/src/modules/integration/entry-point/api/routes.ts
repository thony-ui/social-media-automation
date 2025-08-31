import { Application, Router } from "express";
import { authenticateUser } from "../../../../middleware/authorization";

export function defineIntegrationsRoutes(expressApp: Application) {
  const integrationsRouter = Router();
  integrationsRouter.get("/", (req, res) => {
    res.status(200).json({ message: "List of integrations" });
  });

  expressApp.use("/v1/integrations", authenticateUser, integrationsRouter);
}
