import { NextFunction, Request, Response } from "express";
import logger from "../../../logger";
import { FolderService } from "./folders.service";
import {
  createFolderValidator,
  updateFolderValidator,
} from "./folders.validator";

export class FolderController {
  constructor(private folderService: FolderService) {}

  // POST /api/folders
  createFolder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized: User ID not found",
        });
        return;
      }

      const validationResult = createFolderValidator.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationResult.error.issues,
        });
        return;
      }

      const folder = await this.folderService.createFolder({
        ...validationResult.data,
        userId,
      });

      logger.info(`FolderController: createFolder success for user ${userId}`);
      res.status(201).json({
        success: true,
        message: "Folder created successfully",
        data: folder,
      });
    } catch (error: any) {
      logger.error(`FolderController: createFolder error: ${error.message}`);
      next(error);
    }
  };

  // PUT /api/folders/:id
  updateFolder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized: User ID not found",
        });
        return;
      }

      const folderId = req.params.id;
      if (!folderId) {
        res.status(400).json({
          success: false,
          message: "Folder ID is required",
        });
        return;
      }

      const validationResult = updateFolderValidator.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationResult.error.issues,
        });
        return;
      }

      const folder = await this.folderService.updateFolder({
        ...validationResult.data,
        id: folderId,
        userId,
      });

      logger.info(
        `FolderController: updateFolder success for folder ${folderId}`
      );
      res.status(200).json({
        success: true,
        message: "Folder updated successfully",
        data: folder,
      });
    } catch (error: any) {
      logger.error(`FolderController: updateFolder error: ${error.message}`);
      next(error);
    }
  };

  // GET /api/folders
  getFolders = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized: User ID not found",
        });
        return;
      }

      const folders = await this.folderService.getFolders(userId);

      logger.info(`FolderController: getFolders success for user ${userId}`);
      res.status(200).json({
        success: true,
        message: "Folders retrieved successfully",
        data: folders,
      });
    } catch (error: any) {
      logger.error(`FolderController: getFolders error: ${error.message}`);
      next(error);
    }
  };
  deleteFolder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized: User ID not found",
        });
        return;
      }

      const folderId = req.params.id;
      if (!folderId) {
        res.status(400).json({
          success: false,
          message: "Folder ID is required",
        });
        return;
      }

      await this.folderService.deleteFolder(folderId, userId);

      logger.info(
        `FolderController: deleteFolder success for folder ${folderId}`
      );
      res.status(200).json({
        success: true,
        message: "Folder deleted successfully",
      });
    } catch (error: any) {
      logger.error(`FolderController: deleteFolder error: ${error.message}`);
      next(error);
    }
  };
}
