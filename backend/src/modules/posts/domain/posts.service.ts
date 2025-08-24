import {
  IPostService,
  IPost,
  ICreatePostRequest,
  IUpdatePostRequest,
  IGenerateContentRequest,
} from "./posts.interface";
import { PostRepository } from "./posts.repository";
import logger from "../../../logger";
import { FolderRepository } from "../../folders/domain/folders.repository";
import redisClient from "../../../lib/redis";

export class PostService implements IPostService {
  private postRepository: PostRepository;
  private folderRepository: FolderRepository;

  constructor() {
    this.postRepository = new PostRepository();
    this.folderRepository = new FolderRepository();
  }

  createPost = async (
    data: ICreatePostRequest & { userId: string }
  ): Promise<IPost> => {
    try {
      // Validate folder exists if provided
      if (data.folderId) {
        await this.folderRepository.getFolder(data.folderId, data.userId);
      }

      // Create the post
      const post = await this.postRepository.createPost(data);
      const cacheKey = `posts:${data.userId}`;
      await redisClient.del(cacheKey); // Invalidate cache

      logger.info(`PostService: createPost success for user ${data.userId}`);
      return post;
    } catch (error: any) {
      logger.error(`PostService: createPost error: ${error.message}`);
      throw new Error(`Failed to create post: ${error.message}`);
    }
  };

  updatePost = async (data: IUpdatePostRequest): Promise<IPost> => {
    // Note: userId should be passed from controller based on auth
    const userId = (data as any).userId;
    if (!userId) {
      throw new Error("User ID is required for post update");
    }

    try {
      // First, verify the post exists and belongs to the user
      await this.postRepository.getPost(data.id, userId);

      // Validate folder exists if being updated
      if (data.folderId) {
        await this.folderRepository.getFolder(data.folderId, userId);
      }

      // Update the post
      const post = await this.postRepository.updatePost(data);

      logger.info(`PostService: updatePost success for post ${data.id}`);
      return post;
    } catch (error: any) {
      logger.error(`PostService: updatePost error: ${error.message}`);
      throw new Error(`Failed to update post: ${error.message}`);
    }
  };

  deletePost = async (id: string, userId: string): Promise<void> => {
    try {
      // Verify the post exists and belongs to the user
      await this.postRepository.getPost(id, userId);

      // Delete the post
      await this.postRepository.deletePost(id, userId);

      logger.info(`PostService: deletePost success for post ${id}`);
    } catch (error: any) {
      logger.error(`PostService: deletePost error: ${error.message}`);
      throw new Error(`Failed to delete post: ${error.message}`);
    }
  };

  getPost = async (id: string, userId: string): Promise<IPost> => {
    try {
      const post = await this.postRepository.getPost(id, userId);
      logger.info(`PostService: getPost success for post ${id}`);
      return post;
    } catch (error: any) {
      logger.error(`PostService: getPost error: ${error.message}`);
      throw new Error(`Failed to get post: ${error.message}`);
    }
  };

  getPosts = async (userId: string, filters: any = {}): Promise<IPost[]> => {
    try {
      // Validate folder exists if filtering by folder
      if (filters.folderId) {
        await this.folderRepository.getFolder(filters.folderId, userId);
      }

      // Create a cache key based on userId and filters
      const cacheKey = `posts:${userId}`;

      // Try to get cached posts
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        logger.info(`PostService: getPosts cache hit for user ${userId}`);
        return JSON.parse(cached);
      }

      // If not cached, fetch from repository
      const posts = await this.postRepository.getPosts(userId, filters);

      // Cache the result (set expiration, e.g. 60 seconds)
      await redisClient.set(cacheKey, JSON.stringify(posts));

      logger.info(
        `PostService: getPosts success for user ${userId}, found ${posts.length} posts`
      );
      return posts;
    } catch (error: any) {
      logger.error(`PostService: getPosts error: ${error.message}`);
      throw new Error(`Failed to get posts: ${error.message}`);
    }
  };

  schedulePost = async (
    id: string,
    scheduledAt: string,
    userId: string
  ): Promise<IPost> => {
    try {
      // Validate schedule time is in the future
      const scheduleDate = new Date(scheduledAt);
      const now = new Date();

      if (scheduleDate <= now) {
        throw new Error("Scheduled time must be in the future");
      }

      // Verify the post exists and belongs to the user
      await this.postRepository.getPost(id, userId);

      // Schedule the post
      const post = await this.postRepository.schedulePost(
        id,
        scheduledAt,
        userId
      );

      logger.info(
        `PostService: schedulePost success for post ${id} at ${scheduledAt}`
      );
      return post;
    } catch (error: any) {
      logger.error(`PostService: schedulePost error: ${error.message}`);
      throw new Error(`Failed to schedule post: ${error.message}`);
    }
  };

  unschedulePost = async (id: string, userId: string): Promise<IPost> => {
    try {
      // Verify the post exists and belongs to the user
      await this.postRepository.getPost(id, userId);

      // Unschedule the post
      const post = await this.postRepository.unschedulePost(id, userId);

      logger.info(`PostService: unschedulePost success for post ${id}`);
      return post;
    } catch (error: any) {
      logger.error(`PostService: unschedulePost error: ${error.message}`);
      throw new Error(`Failed to unschedule post: ${error.message}`);
    }
  };

  movePostToFolder = async (
    postId: string,
    folderId: string,
    userId: string
  ): Promise<IPost> => {
    try {
      // Verify the post exists and belongs to the user
      await this.postRepository.getPost(postId, userId);

      // Verify the folder exists and belongs to the user
      await this.folderRepository.getFolder(folderId, userId);

      // Move the post
      const post = await this.postRepository.movePostToFolder(
        postId,
        folderId,
        userId
      );

      logger.info(
        `PostService: movePostToFolder success for post ${postId} to folder ${folderId}`
      );
      return post;
    } catch (error: any) {
      logger.error(`PostService: movePostToFolder error: ${error.message}`);
      throw new Error(`Failed to move post to folder: ${error.message}`);
    }
  };

  generateContent = async (data: IGenerateContentRequest): Promise<void> => {
    // Note: userId should be passed from controller based on auth
    const userId = (data as any).userId;
    if (!userId) {
      throw new Error("User ID is required for content generation");
    }

    try {
      // Generate content using AI
      const content = await this.postRepository.generateContent(data);
      logger.info(`PostService: generateContent success for user ${userId}`);
    } catch (error: any) {
      logger.error(`PostService: generateContent error: ${error.message}`);
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  };

  // Additional business logic methods

  getDashboardStats = async (
    userId: string
  ): Promise<{
    totalPosts: number;
    scheduledPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalFolders: number;
  }> => {
    try {
      const [allPosts, folders] = await Promise.all([
        this.postRepository.getPosts(userId),
        this.folderRepository.getFolders(userId),
      ]);

      const stats = {
        totalPosts: allPosts.length,
        scheduledPosts: allPosts.filter((post) => post.status === "scheduled")
          .length,
        publishedPosts: allPosts.filter((post) => post.status === "published")
          .length,
        draftPosts: allPosts.filter((post) => post.status === "draft").length,
        totalFolders: folders.length,
      };

      logger.info(`PostService: getDashboardStats success for user ${userId}`);
      return stats;
    } catch (error: any) {
      logger.error(`PostService: getDashboardStats error: ${error.message}`);
      throw new Error(`Failed to get dashboard stats: ${error.message}`);
    }
  };

  getScheduledPosts = async (
    userId: string,
    startDate?: string,
    endDate?: string
  ): Promise<IPost[]> => {
    try {
      const filters: any = { status: "scheduled" };

      // For now, basic filtering - could be enhanced with date range filtering
      const posts = await this.postRepository.getPosts(userId, filters);

      // Filter by date range if provided
      let filteredPosts = posts;
      if (startDate || endDate) {
        filteredPosts = posts.filter((post) => {
          if (!post.scheduledAt) return false;

          const postDate = new Date(post.scheduledAt);

          if (startDate && postDate < new Date(startDate)) return false;
          if (endDate && postDate > new Date(endDate)) return false;

          return true;
        });
      }

      logger.info(
        `PostService: getScheduledPosts success for user ${userId}, found ${filteredPosts.length} posts`
      );
      return filteredPosts;
    } catch (error: any) {
      logger.error(`PostService: getScheduledPosts error: ${error.message}`);
      throw new Error(`Failed to get scheduled posts: ${error.message}`);
    }
  };

  duplicatePost = async (postId: string, userId: string): Promise<IPost> => {
    try {
      // Get the original post
      const originalPost = await this.postRepository.getPost(postId, userId);

      // Create a new post with the same data but different title
      const duplicateData: ICreatePostRequest & { userId: string } = {
        userId,
        caption: `${originalPost.caption} (Copy)`,
        hashtags: originalPost.hashtags,
        platform: originalPost.platform,
        folderId: originalPost.folderId,
        imagePrompt: originalPost.imagePrompt,
        // Don't copy scheduled date - make it a draft
      };

      const duplicatedPost = await this.postRepository.createPost(
        duplicateData
      );

      logger.info(`PostService: duplicatePost success for post ${postId}`);
      return duplicatedPost;
    } catch (error: any) {
      logger.error(`PostService: duplicatePost error: ${error.message}`);
      throw new Error(`Failed to duplicate post: ${error.message}`);
    }
  };
}
