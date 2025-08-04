import { Application, Router } from "express";
import { authenticateUser } from "../../../../middleware/authorization";
import { FolderController } from "../../domain/folders.controller";
import { FolderService } from "../../domain/folders.service";

export function defineFolderRoutes(expressApp: Application) {
  const foldersRouter = Router();
  const folderService = new FolderService();
  const folderController = new FolderController(folderService);

  foldersRouter.post("/folders", folderController.createFolder);
  foldersRouter.put("/folders/:id", folderController.updateFolder);
  foldersRouter.delete("/folders/:id", folderController.deleteFolder);
  foldersRouter.get("/folders", folderController.getFolders);

  expressApp.use("/v1", authenticateUser, foldersRouter);
}
