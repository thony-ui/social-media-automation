import supabase from "../../../lib/supabase-client";
import logger from "../../../logger";
import {
  IPostService,
  IPost,
  ICreatePostRequest,
  IUpdatePostRequest,
  IGenerateContentRequest,
} from "./posts.interface";

export class PostRepository implements IPostService {
  createPost = async (
    data: ICreatePostRequest & { userId: string }
  ): Promise<IPost> => {
    const { data: insertData, error } = await supabase
      .from("posts")
      .insert({
        userId: data.userId,
        caption: data.caption,
        hashtags: data.hashtags,
        platform: data.platform || "all",
        folderId: data.folderId,
        imagePrompt: data.imagePrompt,
        status: data.scheduledAt ? "scheduled" : "draft",
        scheduledAt: data.scheduledAt,
        created_at: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      logger.error(`PostRepository: createPost error: ${error.message}`);
      throw new Error(`Error creating post: ${error.message}`);
    }

    logger.info(
      `PostRepository: createPost success: ${JSON.stringify(insertData)}`
    );
    return this.mapDbPostToInterface(insertData);
  };

  updatePost = async (data: IUpdatePostRequest): Promise<IPost> => {
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (data.caption !== undefined) updateData.caption = data.caption;
    if (data.hashtags !== undefined) updateData.hashtags = data.hashtags;
    if (data.platform !== undefined) updateData.platform = data.platform;
    if (data.folderId !== undefined) updateData.folderId = data.folderId;
    if (data.imagePrompt !== undefined)
      updateData.imagePrompt = data.imagePrompt;
    if (data.scheduledAt !== undefined)
      updateData.scheduledAt = data.scheduledAt;
    if (data.status !== undefined) updateData.status = data.status;

    const { data: updatedData, error } = await supabase
      .from("posts")
      .update(updateData)
      .eq("id", data.id)
      .select()
      .single();

    if (error) {
      logger.error(`PostRepository: updatePost error: ${error.message}`);
      throw new Error(`Error updating post: ${error.message}`);
    }

    logger.info(
      `PostRepository: updatePost success: ${JSON.stringify(updatedData)}`
    );
    return this.mapDbPostToInterface(updatedData);
  };

  deletePost = async (id: string, userId: string): Promise<void> => {
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id)
      .eq("userId", userId);

    if (error) {
      logger.error(`PostRepository: deletePost error: ${error.message}`);
      throw new Error(`Error deleting post: ${error.message}`);
    }

    logger.info(`PostRepository: deletePost success for id: ${id}`);
  };

  getPost = async (id: string, userId: string): Promise<IPost> => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .eq("userId", userId)
      .single();

    if (error) {
      logger.error(`PostRepository: getPost error: ${error.message}`);
      throw new Error(`Error fetching post: ${error.message}`);
    }

    logger.info(`PostRepository: getPost success: ${JSON.stringify(data)}`);
    return this.mapDbPostToInterface(data);
  };

  getPosts = async (userId: string, filters: any = {}): Promise<IPost[]> => {
    let query = supabase
      .from("posts")
      .select("*")
      .eq("userId", userId)
      .order("created_at", { ascending: false });

    if (filters.folderId) {
      query = query.eq("folderId", filters.folderId);
    }
    if (filters.status) {
      query = query.eq("status", filters.status);
    }
    if (filters.platform) {
      query = query.eq("platform", filters.platform);
    }
    if (filters.search) {
      query = query.ilike("caption", `%${filters.search}%`);
    }
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 50) - 1
      );
    }

    const { data, error } = await query;

    if (error) {
      logger.error(`PostRepository: getPosts error: ${error.message}`);
      throw new Error(`Error fetching posts: ${error.message}`);
    }

    logger.info(
      `PostRepository: getPosts success: ${data?.length} posts fetched`
    );
    return data?.map(this.mapDbPostToInterface) || [];
  };

  schedulePost = async (
    id: string,
    scheduledAt: string,
    userId: string
  ): Promise<IPost> => {
    const { data, error } = await supabase
      .from("posts")
      .update({
        scheduledAt: scheduledAt,
        status: "scheduled",
        updatedAt: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("userId", userId)
      .select()
      .single();

    if (error) {
      logger.error(`PostRepository: schedulePost error: ${error.message}`);
      throw new Error(`Error scheduling post: ${error.message}`);
    }

    logger.info(
      `PostRepository: schedulePost success: ${JSON.stringify(data)}`
    );
    return this.mapDbPostToInterface(data);
  };

  unschedulePost = async (id: string, userId: string): Promise<IPost> => {
    const { data, error } = await supabase
      .from("posts")
      .update({
        scheduledAt: null,
        status: "draft",
        updatedAt: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("userId", userId)
      .select()
      .single();

    if (error) {
      logger.error(`PostRepository: unschedulePost error: ${error.message}`);
      throw new Error(`Error unscheduling post: ${error.message}`);
    }

    logger.info(
      `PostRepository: unschedulePost success: ${JSON.stringify(data)}`
    );
    return this.mapDbPostToInterface(data);
  };

  movePostToFolder = async (
    postId: string,
    folderId: string,
    userId: string
  ): Promise<IPost> => {
    const { data, error } = await supabase
      .from("posts")
      .update({
        folderId: folderId,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", postId)
      .eq("userId", userId)
      .select()
      .single();

    if (error) {
      logger.error(`PostRepository: movePostToFolder error: ${error.message}`);
      throw new Error(`Error moving post to folder: ${error.message}`);
    }

    logger.info(
      `PostRepository: movePostToFolder success: ${JSON.stringify(data)}`
    );
    return this.mapDbPostToInterface(data);
  };

  generateContent = async (
    data: IGenerateContentRequest
  ): Promise<{ caption: string; hashtags?: string }> => {
    // This would integrate with OpenAI API
    // For now, return mock data
    logger.info(
      `PostRepository: generateContent called with prompt: ${data.prompt}`
    );

    // Mock AI generation - replace with actual OpenAI integration
    const mockContent = {
      caption: `Generated content based on: "${data.prompt}". This is a placeholder for AI-generated content that would be created using OpenAI's API.`,
      hashtags: data.includeHashtags
        ? "#contentcreation #socialmedia #ai #marketing"
        : undefined,
    };

    return mockContent;
  };

  private mapDbPostToInterface = (dbPost: any): IPost => {
    return {
      id: dbPost.id,
      userId: dbPost.userId,
      caption: dbPost.caption,
      hashtags: dbPost.hashtags,
      platform: dbPost.platform,
      folderId: dbPost.folderId,
      imagePrompt: dbPost.imagePrompt,
      imageUrl: dbPost.imageUrl,
      status: dbPost.status,
      scheduledAt: dbPost.scheduledAt,
      publishedAt: dbPost.publishedAt,
      createdAt: dbPost.created_at,
      updatedAt: dbPost.updatedAt,
    };
  };
}
