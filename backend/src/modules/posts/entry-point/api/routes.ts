import { Application, Router } from "express";
import { authenticateUser } from "../../../../middleware/authorization";
import { PostController } from "../../domain/posts.controller";
import { PostService } from "../../domain/posts.service";

export function definePostsRoutes(expressApp: Application) {
  const postsRouter = Router();
  const postService = new PostService();
  const postController = new PostController(postService);

  // Post routes
  postsRouter.post("/posts", postController.createPost);
  postsRouter.put("/posts/:id", postController.updatePost);
  postsRouter.delete("/posts/:id", postController.deletePost);
  postsRouter.get("/posts/:id", postController.getPost);
  postsRouter.get("/posts", postController.getPosts);
  postsRouter.post("/posts/generate-content", postController.generateContent);

  expressApp.use("/v1", authenticateUser, postsRouter);
}
