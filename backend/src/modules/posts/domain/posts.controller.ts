import type { NextFunction, Request, Response } from "express";
import { PostService } from "./posts.service";
import {
  createPostValidator,
  updatePostValidator,
  generateContentValidator,
} from "./posts.validator";
import logger from "../../../logger";

export class PostController {
  constructor(private postService: PostService) {}

  // POST /api/posts
  createPost = async (
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

      const validationResult = createPostValidator.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationResult.error.issues,
        });
        return;
      }

      const post = await this.postService.createPost({
        ...validationResult.data,
        userId,
      });

      logger.info(`PostController: createPost success for user ${userId}`);
      res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: post,
      });
    } catch (error: any) {
      logger.error(`PostController: createPost error: ${error.message}`);
      next(error);
    }
  };

  // PUT /api/posts/:id
  updatePost = async (
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

      const postId = req.params.id;
      if (!postId) {
        res.status(400).json({
          success: false,
          message: "Post ID is required",
        });
        return;
      }

      const validationResult = updatePostValidator.safeParse(req.body);

      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationResult.error.issues,
        });
        return;
      }

      // Add userId to the data for service layer validation
      const updateData = {
        ...validationResult.data,
        id: postId,
        userId,
      };

      const post = await this.postService.updatePost(updateData);

      logger.info(`PostController: updatePost success for post ${postId}`);
      res.status(200).json({
        success: true,
        message: "Post updated successfully",
        data: post,
      });
    } catch (error: any) {
      logger.error(`PostController: updatePost error: ${error.message}`);
      next(error);
    }
  };

  // DELETE /api/posts/:id
  deletePost = async (
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

      const postId = req.params.id;
      if (!postId) {
        res.status(400).json({
          success: false,
          message: "Post ID is required",
        });
        return;
      }

      await this.postService.deletePost(postId, userId);

      logger.info(`PostController: deletePost success for post ${postId}`);
      res.status(200).json({
        success: true,
        message: "Post deleted successfully",
      });
    } catch (error: any) {
      logger.error(`PostController: deletePost error: ${error.message}`);
      next(error);
    }
  };

  // GET /api/posts/:id
  getPost = async (
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

      const postId = req.params.id;
      if (!postId) {
        res.status(400).json({
          success: false,
          message: "Post ID is required",
        });
        return;
      }

      const post = await this.postService.getPost(postId, userId);

      logger.info(`PostController: getPost success for post ${postId}`);
      res.status(200).json({
        success: true,
        message: "Post retrieved successfully",
        data: post,
      });
    } catch (error: any) {
      logger.error(`PostController: getPost error: ${error.message}`);
      next(error);
    }
  };

  // GET /api/posts
  getPosts = async (
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

      // Extract query parameters for filtering
      const filters = {
        folderId: req.query.folderId as string,
        status: req.query.status as string,
        platform: req.query.platform as string,
        search: req.query.search as string,
        limit: req.query.limit
          ? parseInt(req.query.limit as string)
          : undefined,
        offset: req.query.offset
          ? parseInt(req.query.offset as string)
          : undefined,
      };

      // Remove undefined values
      Object.keys(filters).forEach(
        (key) =>
          (filters as any)[key] === undefined && delete (filters as any)[key]
      );

      const posts = await this.postService.getPosts(userId, filters);

      logger.info(
        `PostController: getPosts success for user ${userId}, found ${posts.length} posts`
      );
      res.status(200).json({
        success: true,
        message: "Posts retrieved successfully",
        data: posts,
        total: posts.length,
      });
    } catch (error: any) {
      logger.error(`PostController: getPosts error: ${error.message}`);
      next(error);
    }
  };

  // POST /api/posts/generate-content
  generateContent = async (
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

      const validationResult = generateContentValidator.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationResult.error.issues,
        });
        return;
      }

      // Add userId to the data for service layer
      const generateData = {
        ...validationResult.data,
        userId,
      };

      await this.postService.generateContent(generateData);

      logger.info(`PostController: generateContent success for user ${userId}`);
      res.status(201).json({
        success: true,
        message: "Content generated successfully",
        data: null,
      });
    } catch (error: any) {
      logger.error(`PostController: generateContent error: ${error.message}`);
      next(error);
    }
  };
}
