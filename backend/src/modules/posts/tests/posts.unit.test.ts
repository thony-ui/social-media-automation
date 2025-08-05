import type { Request, Response, NextFunction } from "express";
import { PostController } from "../domain/posts.controller";
import { PostRepository } from "../domain/posts.repository";
import { PostService } from "../domain/posts.service";
import { IGenerateContentRequest, IPost } from "../domain/posts.interface";
import { IFolder } from "../../folders/domain/folders.interface";
import { FolderRepository } from "../../folders/domain/folders.repository";
import { FolderService } from "../../folders/domain/folders.service";
import { FolderController } from "../../folders/domain/folders.controller";

describe("PostService", () => {
  let postService: PostService;
  let postRepository: PostRepository;
  let folderRepository: FolderRepository;

  beforeEach(() => {
    postRepository = {
      createPost: jest.fn(),
      updatePost: jest.fn(),
      deletePost: jest.fn(),
      getPost: jest.fn(),
      getPosts: jest.fn(),
      schedulePost: jest.fn(),
      unschedulePost: jest.fn(),
      movePostToFolder: jest.fn(),
      generateContent: jest.fn(),
    } as unknown as PostRepository;

    folderRepository = {
      createFolder: jest.fn(),
      updateFolder: jest.fn(),
      deleteFolder: jest.fn(),
      getFolder: jest.fn(),
      getFolders: jest.fn(),
    } as unknown as FolderRepository;

    postService = new PostService();
    // Mock the private repositories
    (postService as any).postRepository = postRepository;
    (postService as any).folderRepository = folderRepository;
  });

  describe("createPost", () => {
    it("should create post successfully", async () => {
      const postData = {
        userId: "user-123",
        caption: "Test post",
        hashtags: "#test",
        platform: "instagram" as const,
      };

      const mockPost: IPost = {
        id: "post-123",
        userId: "user-123",
        caption: "Test post",
        hashtags: "#test",
        platform: "instagram",
        status: "draft",
        createdAt: "2025-08-04T00:00:00Z",
        updatedAt: "2025-08-04T00:00:00Z",
      };

      (postRepository.createPost as jest.Mock).mockResolvedValue(mockPost);

      const result = await postService.createPost(postData);

      expect(result).toEqual(mockPost);
      expect(postRepository.createPost).toHaveBeenCalledWith(postData);
    });

    it("should validate folder exists when folderId is provided", async () => {
      const postData = {
        userId: "user-123",
        caption: "Test post",
        folderId: "folder-123",
      };

      const mockFolder: IFolder = {
        id: "folder-123",
        userId: "user-123",
        name: "Test Folder",
        createdAt: "2025-08-04T00:00:00Z",
        updatedAt: "2025-08-04T00:00:00Z",
      };

      const mockPost: IPost = {
        id: "post-123",
        userId: "user-123",
        caption: "Test post",
        folderId: "folder-123",
        status: "draft",
        createdAt: "2025-08-04T00:00:00Z",
        updatedAt: "2025-08-04T00:00:00Z",
      };

      (folderRepository.getFolder as jest.Mock).mockResolvedValue(mockFolder);
      (postRepository.createPost as jest.Mock).mockResolvedValue(mockPost);

      const result = await postService.createPost(postData);

      expect(folderRepository.getFolder).toHaveBeenCalledWith(
        "folder-123",
        "user-123"
      );
      expect(result).toEqual(mockPost);
    });

    it("should throw error if folder validation fails", async () => {
      const postData = {
        userId: "user-123",
        caption: "Test post",
        folderId: "folder-123",
      };

      (folderRepository.getFolder as jest.Mock).mockRejectedValue(
        new Error("Folder not found")
      );

      await expect(postService.createPost(postData)).rejects.toThrow(
        "Failed to create post: Folder not found"
      );
    });
  });

  describe("updatePost", () => {
    it("should update post successfully", async () => {
      const updateData = {
        id: "post-123",
        userId: "user-123",
        caption: "Updated caption",
      };

      const existingPost: IPost = {
        id: "post-123",
        userId: "user-123",
        caption: "Original caption",
        status: "draft",
        createdAt: "2025-08-04T00:00:00Z",
        updatedAt: "2025-08-04T00:00:00Z",
      };

      const updatedPost: IPost = {
        ...existingPost,
        caption: "Updated caption",
        updatedAt: "2025-08-04T01:00:00Z",
      };

      (postRepository.getPost as jest.Mock).mockResolvedValue(existingPost);
      (postRepository.updatePost as jest.Mock).mockResolvedValue(updatedPost);

      const result = await postService.updatePost(updateData);

      expect(postRepository.getPost).toHaveBeenCalledWith(
        "post-123",
        "user-123"
      );
      expect(postRepository.updatePost).toHaveBeenCalledWith(updateData);
      expect(result).toEqual(updatedPost);
    });

    it("should throw error if post does not exist", async () => {
      const updateData = {
        id: "post-123",
        userId: "user-123",
        caption: "Updated caption",
      };

      (postRepository.getPost as jest.Mock).mockRejectedValue(
        new Error("Post not found")
      );

      await expect(postService.updatePost(updateData)).rejects.toThrow(
        "Failed to update post: Post not found"
      );
    });
  });

  describe("deletePost", () => {
    it("should delete post successfully", async () => {
      const postId = "post-123";
      const userId = "user-123";

      const existingPost: IPost = {
        id: "post-123",
        userId: "user-123",
        caption: "Test post",
        status: "draft",
        createdAt: "2025-08-04T00:00:00Z",
        updatedAt: "2025-08-04T00:00:00Z",
      };

      (postRepository.getPost as jest.Mock).mockResolvedValue(existingPost);
      (postRepository.deletePost as jest.Mock).mockResolvedValue(undefined);

      await postService.deletePost(postId, userId);

      expect(postRepository.getPost).toHaveBeenCalledWith(postId, userId);
      expect(postRepository.deletePost).toHaveBeenCalledWith(postId, userId);
    });
  });

  describe("getPosts", () => {
    it("should get posts successfully", async () => {
      const userId = "user-123";
      const filters = { status: "draft" };

      const mockPosts: IPost[] = [
        {
          id: "post-1",
          userId: "user-123",
          caption: "Post 1",
          status: "draft",
          createdAt: "2025-08-04T00:00:00Z",
          updatedAt: "2025-08-04T00:00:00Z",
        },
        {
          id: "post-2",
          userId: "user-123",
          caption: "Post 2",
          status: "draft",
          createdAt: "2025-08-04T00:00:00Z",
          updatedAt: "2025-08-04T00:00:00Z",
        },
      ];

      (postRepository.getPosts as jest.Mock).mockResolvedValue(mockPosts);

      const result = await postService.getPosts(userId, filters);

      expect(postRepository.getPosts).toHaveBeenCalledWith(userId, filters);
      expect(result).toEqual(mockPosts);
    });
  });

  describe("schedulePost", () => {
    it("should schedule post successfully", async () => {
      const postId = "post-123";
      const userId = "user-123";
      const futureDate = new Date(Date.now() + 86400000).toISOString(); // Tomorrow

      const existingPost: IPost = {
        id: "post-123",
        userId: "user-123",
        caption: "Test post",
        status: "draft",
        createdAt: "2025-08-04T00:00:00Z",
        updatedAt: "2025-08-04T00:00:00Z",
      };

      const scheduledPost: IPost = {
        ...existingPost,
        status: "scheduled",
        scheduledAt: futureDate,
        updatedAt: "2025-08-04T01:00:00Z",
      };

      (postRepository.getPost as jest.Mock).mockResolvedValue(existingPost);
      (postRepository.schedulePost as jest.Mock).mockResolvedValue(
        scheduledPost
      );

      const result = await postService.schedulePost(postId, futureDate, userId);

      expect(postRepository.getPost).toHaveBeenCalledWith(postId, userId);
      expect(postRepository.schedulePost).toHaveBeenCalledWith(
        postId,
        futureDate,
        userId
      );
      expect(result).toEqual(scheduledPost);
    });

    it("should throw error if scheduled time is in the past", async () => {
      const postId = "post-123";
      const userId = "user-123";
      const pastDate = new Date(Date.now() - 86400000).toISOString(); // Yesterday

      await expect(
        postService.schedulePost(postId, pastDate, userId)
      ).rejects.toThrow(
        "Failed to schedule post: Scheduled time must be in the future"
      );
    });
  });

  describe("generateContent", () => {
    it("should generate content successfully", async () => {
      const generateData: IGenerateContentRequest = {
        brandName: "TechCorp",
        productDescription: "Latest AI technology",
        targetAudience: "tech enthusiasts",
        numberOfPosts: 3,
        userId: "user-123",
      };

      const mockContent = {
        caption: "Generated content about AI",
        hashtags: "#AI #technology",
      };

      (postRepository.generateContent as jest.Mock).mockResolvedValue(
        mockContent
      );

      const result = await postService.generateContent(generateData);

      expect(postRepository.generateContent).toHaveBeenCalledWith(generateData);
      expect(result).toEqual(mockContent);
    });

    it("should throw error if prompt is empty", async () => {
      const generateData: IGenerateContentRequest = {
        brandName: "TechCorp",
        productDescription: "Latest AI technology",
        targetAudience: "tech enthusiasts",
        numberOfPosts: 3,
        userId: "user-123",
      };

      await expect(postService.generateContent(generateData)).rejects.toThrow(
        "Failed to generate content: Prompt is required for content generation"
      );
    });

    it("should throw error if prompt is too long", async () => {
      const generateData: IGenerateContentRequest = {
        brandName: "TechCorp",
        productDescription: "Latest AI technology",
        targetAudience: "tech enthusiasts",
        numberOfPosts: 3,
        userId: "user-123",
      };

      await expect(postService.generateContent(generateData)).rejects.toThrow(
        "Failed to generate content: Prompt must be less than 500 characters"
      );
    });
  });
});

describe("FolderService", () => {
  let folderService: FolderService;
  let folderRepository: FolderRepository;
  let postRepository: PostRepository;

  beforeEach(() => {
    folderRepository = {
      createFolder: jest.fn(),
      updateFolder: jest.fn(),
      deleteFolder: jest.fn(),
      getFolder: jest.fn(),
      getFolders: jest.fn(),
    } as unknown as FolderRepository;

    postRepository = {
      getPosts: jest.fn(),
      movePostToFolder: jest.fn(),
      updatePost: jest.fn(),
    } as unknown as PostRepository;

    folderService = new FolderService();
    // Mock the private repositories
    (folderService as any).folderRepository = folderRepository;
    (folderService as any).postRepository = postRepository;
  });

  describe("createFolder", () => {
    it("should create folder successfully", async () => {
      const folderData = {
        userId: "user-123",
        name: "Test Folder",
        description: "Test description",
        color: "#3B82F6",
      };

      const mockFolder: IFolder = {
        id: "folder-123",
        userId: "user-123",
        name: "Test Folder",
        description: "Test description",
        color: "#3B82F6",
        createdAt: "2025-08-04T00:00:00Z",
        updatedAt: "2025-08-04T00:00:00Z",
      };

      (folderRepository.getFolders as jest.Mock).mockResolvedValue([]);
      (folderRepository.createFolder as jest.Mock).mockResolvedValue(
        mockFolder
      );

      const result = await folderService.createFolder(folderData);

      expect(folderRepository.getFolders).toHaveBeenCalledWith("user-123");
      expect(folderRepository.createFolder).toHaveBeenCalledWith(folderData);
      expect(result).toEqual(mockFolder);
    });

    it("should throw error if folder name already exists", async () => {
      const folderData = {
        userId: "user-123",
        name: "Existing Folder",
      };

      const existingFolders: IFolder[] = [
        {
          id: "folder-1",
          userId: "user-123",
          name: "Existing Folder",
          createdAt: "2025-08-04T00:00:00Z",
          updatedAt: "2025-08-04T00:00:00Z",
        },
      ];

      (folderRepository.getFolders as jest.Mock).mockResolvedValue(
        existingFolders
      );

      await expect(folderService.createFolder(folderData)).rejects.toThrow(
        "Failed to create folder: A folder with this name already exists"
      );
    });
  });

  describe("deleteFolder", () => {
    it("should delete folder and move posts to another folder", async () => {
      const folderId = "folder-123";
      const userId = "user-123";
      const movePostsToFolderId = "folder-456";

      const existingFolder: IFolder = {
        id: "folder-123",
        userId: "user-123",
        name: "Test Folder",
        createdAt: "2025-08-04T00:00:00Z",
        updatedAt: "2025-08-04T00:00:00Z",
      };

      const destinationFolder: IFolder = {
        id: "folder-456",
        userId: "user-123",
        name: "Destination Folder",
        createdAt: "2025-08-04T00:00:00Z",
        updatedAt: "2025-08-04T00:00:00Z",
      };

      const postsInFolder: IPost[] = [
        {
          id: "post-1",
          userId: "user-123",
          caption: "Post 1",
          folderId: "folder-123",
          status: "draft",
          createdAt: "2025-08-04T00:00:00Z",
          updatedAt: "2025-08-04T00:00:00Z",
        },
      ];

      (folderRepository.getFolder as jest.Mock)
        .mockResolvedValueOnce(existingFolder)
        .mockResolvedValueOnce(destinationFolder);
      (postRepository.getPosts as jest.Mock).mockResolvedValue(postsInFolder);
      (postRepository.movePostToFolder as jest.Mock).mockResolvedValue({});
      (folderRepository.deleteFolder as jest.Mock).mockResolvedValue(undefined);

      await folderService.deleteFolder(folderId, userId, movePostsToFolderId);

      expect(folderRepository.getFolder).toHaveBeenCalledWith(folderId, userId);
      expect(postRepository.getPosts).toHaveBeenCalledWith(userId, {
        folderId,
      });
      expect(folderRepository.getFolder).toHaveBeenCalledWith(
        movePostsToFolderId,
        userId
      );
      expect(postRepository.movePostToFolder).toHaveBeenCalledWith(
        "post-1",
        movePostsToFolderId,
        userId
      );
      expect(folderRepository.deleteFolder).toHaveBeenCalledWith(
        folderId,
        userId
      );
    });
  });
});

describe("PostController", () => {
  let postController: PostController;
  let postService: PostService;
  let request: Partial<Request>;
  let response: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    postService = {
      createPost: jest.fn(),
      updatePost: jest.fn(),
      deletePost: jest.fn(),
      getPost: jest.fn(),
      getPosts: jest.fn(),
      generateContent: jest.fn(),
    } as unknown as PostService;

    postController = new PostController(postService);

    request = {
      body: {},
      params: {},
      query: {},
      user: { id: "user-123" },
    } as Partial<Request>;

    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    nextFunction = jest.fn() as NextFunction;
  });

  describe("createPost", () => {
    it("should create post successfully", async () => {
      const postData = {
        caption: "Test post",
        hashtags: "#test",
        platform: "instagram",
      };

      const mockPost: IPost = {
        id: "post-123",
        userId: "user-123",
        caption: "Test post",
        hashtags: "#test",
        platform: "instagram",
        status: "draft",
        createdAt: "2025-08-04T00:00:00Z",
        updatedAt: "2025-08-04T00:00:00Z",
      };

      request.body = postData;
      (postService.createPost as jest.Mock).mockResolvedValue(mockPost);

      await postController.createPost(
        request as Request,
        response as Response,
        nextFunction
      );

      expect(postService.createPost).toHaveBeenCalledWith({
        ...postData,
        userId: "user-123",
      });
      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.json).toHaveBeenCalledWith({
        success: true,
        message: "Post created successfully",
        data: mockPost,
      });
    });

    it("should return 401 if user is not authenticated", async () => {
      request.user = undefined;

      await postController.createPost(
        request as Request,
        response as Response,
        nextFunction
      );

      expect(response.status).toHaveBeenCalledWith(401);
      expect(response.json).toHaveBeenCalledWith({
        success: false,
        message: "Unauthorized: User ID not found",
      });
    });

    it("should handle validation errors", async () => {
      request.body = { caption: "" }; // Invalid caption

      await postController.createPost(
        request as Request,
        response as Response,
        nextFunction
      );

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Validation error",
        })
      );
    });

    it("should handle service errors", async () => {
      const postData = {
        caption: "Test post",
        platform: "instagram",
      };

      const error = new Error("Service error");
      request.body = postData;
      (postService.createPost as jest.Mock).mockRejectedValue(error);

      await postController.createPost(
        request as Request,
        response as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(error);
    });
  });

  describe("getPosts", () => {
    it("should get posts successfully", async () => {
      const mockPosts: IPost[] = [
        {
          id: "post-1",
          userId: "user-123",
          caption: "Post 1",
          status: "draft",
          createdAt: "2025-08-04T00:00:00Z",
          updatedAt: "2025-08-04T00:00:00Z",
        },
      ];

      request.query = { status: "draft", limit: "10" };
      (postService.getPosts as jest.Mock).mockResolvedValue(mockPosts);

      await postController.getPosts(
        request as Request,
        response as Response,
        nextFunction
      );

      expect(postService.getPosts).toHaveBeenCalledWith("user-123", {
        status: "draft",
        limit: 10,
      });
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        success: true,
        message: "Posts retrieved successfully",
        data: mockPosts,
        total: 1,
      });
    });
  });

  describe("generateContent", () => {
    it("should generate content successfully", async () => {
      const generateData = {
        prompt: "Write about AI",
        platform: "instagram",
        includeHashtags: true,
      };

      const mockContent = {
        caption: "Generated content about AI",
        hashtags: "#AI #technology",
      };

      request.body = generateData;
      (postService.generateContent as jest.Mock).mockResolvedValue(mockContent);

      await postController.generateContent(
        request as Request,
        response as Response,
        nextFunction
      );

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        success: true,
        message: "Content generated successfully",
        data: mockContent,
      });
    });
  });
});

describe("FolderController", () => {
  let folderController: FolderController;
  let folderService: FolderService;
  let request: Partial<Request>;
  let response: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    folderService = {
      createFolder: jest.fn(),
      updateFolder: jest.fn(),
      deleteFolder: jest.fn(),
      getFolder: jest.fn(),
      getFolders: jest.fn(),
    } as unknown as FolderService;

    folderController = new FolderController(folderService);

    request = {
      body: {},
      params: {},
      user: { id: "user-123" },
    } as Partial<Request>;

    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    nextFunction = jest.fn() as NextFunction;
  });

  describe("createFolder", () => {
    it("should create folder successfully", async () => {
      const folderData = {
        name: "Test Folder",
        description: "Test description",
        color: "#3B82F6",
      };

      const mockFolder: IFolder = {
        id: "folder-123",
        userId: "user-123",
        name: "Test Folder",
        description: "Test description",
        color: "#3B82F6",
        createdAt: "2025-08-04T00:00:00Z",
        updatedAt: "2025-08-04T00:00:00Z",
      };

      request.body = folderData;
      (folderService.createFolder as jest.Mock).mockResolvedValue(mockFolder);

      await folderController.createFolder(
        request as Request,
        response as Response,
        nextFunction
      );

      expect(folderService.createFolder).toHaveBeenCalledWith({
        ...folderData,
        userId: "user-123",
      });
      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.json).toHaveBeenCalledWith({
        success: true,
        message: "Folder created successfully",
        data: mockFolder,
      });
    });

    it("should handle service errors", async () => {
      const folderData = {
        name: "Test Folder",
      };

      const error = new Error("Service error");
      request.body = folderData;
      (folderService.createFolder as jest.Mock).mockRejectedValue(error);

      await folderController.createFolder(
        request as Request,
        response as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(error);
    });
  });

  describe("getFolders", () => {
    it("should get folders successfully", async () => {
      const mockFolders: IFolder[] = [
        {
          id: "folder-1",
          userId: "user-123",
          name: "Folder 1",
          createdAt: "2025-08-04T00:00:00Z",
          updatedAt: "2025-08-04T00:00:00Z",
        },
      ];

      (folderService.getFolders as jest.Mock).mockResolvedValue(mockFolders);

      await folderController.getFolders(
        request as Request,
        response as Response,
        nextFunction
      );

      expect(folderService.getFolders).toHaveBeenCalledWith("user-123");
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        success: true,
        message: "Folders retrieved successfully",
        data: mockFolders,
      });
    });
  });
});
