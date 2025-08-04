import logger from "../../../logger";
import { IPost } from "../../posts/domain/posts.interface";
import { PostRepository } from "../../posts/domain/posts.repository";
import { IFolderService, IFolder } from "./folders.interface";
import { FolderRepository } from "./folders.repository";

export class FolderService implements IFolderService {
  private folderRepository: FolderRepository;
  private postRepository: PostRepository;

  constructor() {
    this.folderRepository = new FolderRepository();
    this.postRepository = new PostRepository();
  }

  createFolder = async (data: {
    name: string;
    description?: string;
    color?: string;
    userId: string;
  }): Promise<IFolder> => {
    try {
      // Validate folder name is unique for this user
      const existingFolders = await this.folderRepository.getFolders(
        data.userId
      );
      const nameExists = existingFolders.some(
        (folder) => folder.name.toLowerCase() === data.name.toLowerCase()
      );

      if (nameExists) {
        throw new Error("A folder with this name already exists");
      }

      const folder = await this.folderRepository.createFolder(data);

      logger.info(
        `FolderService: createFolder success for user ${data.userId}`
      );
      return folder;
    } catch (error: any) {
      logger.error(`FolderService: createFolder error: ${error.message}`);
      throw new Error(`Failed to create folder: ${error.message}`);
    }
  };

  updateFolder = async (data: {
    id: string;
    name?: string;
    description?: string;
    color?: string;
    userId: string;
  }): Promise<IFolder> => {
    try {
      // Verify the folder exists and belongs to the user
      await this.folderRepository.getFolder(data.id, data.userId);

      // If updating name, check it's unique
      if (data.name) {
        const existingFolders = await this.folderRepository.getFolders(
          data.userId
        );
        const nameExists = existingFolders.some(
          (folder) =>
            folder.id !== data.id &&
            folder.name.toLowerCase() === data.name!.toLowerCase()
        );

        if (nameExists) {
          throw new Error("A folder with this name already exists");
        }
      }

      const folder = await this.folderRepository.updateFolder(data);

      logger.info(`FolderService: updateFolder success for folder ${data.id}`);
      return folder;
    } catch (error: any) {
      logger.error(`FolderService: updateFolder error: ${error.message}`);
      throw new Error(`Failed to update folder: ${error.message}`);
    }
  };

  deleteFolder = async (
    id: string,
    userId: string,
    movePostsToFolderId?: string
  ): Promise<void> => {
    try {
      // Verify the folder exists and belongs to the user
      await this.folderRepository.getFolder(id, userId);

      // Get posts in this folder
      const postsInFolder = await this.postRepository.getPosts(userId, {
        folderId: id,
      });

      if (postsInFolder.length > 0) {
        if (movePostsToFolderId) {
          // Verify destination folder exists
          await this.folderRepository.getFolder(movePostsToFolderId, userId);

          // Move all posts to the new folder
          await Promise.all(
            postsInFolder.map((post) =>
              this.postRepository.movePostToFolder(
                post.id,
                movePostsToFolderId,
                userId
              )
            )
          );
        } else {
          // Move posts to no folder (undefined)
          await Promise.all(
            postsInFolder.map((post) =>
              this.postRepository.updatePost({
                id: post.id,
                folderId: null,
              })
            )
          );
        }
      }

      // Delete the folder
      await this.folderRepository.deleteFolder(id, userId);

      logger.info(`FolderService: deleteFolder success for folder ${id}`);
    } catch (error: any) {
      logger.error(`FolderService: deleteFolder error: ${error.message}`);
      throw new Error(`Failed to delete folder: ${error.message}`);
    }
  };

  getFolder = async (id: string, userId: string): Promise<IFolder> => {
    try {
      const folder = await this.folderRepository.getFolder(id, userId);
      logger.info(`FolderService: getFolder success for folder ${id}`);
      return folder;
    } catch (error: any) {
      logger.error(`FolderService: getFolder error: ${error.message}`);
      throw new Error(`Failed to get folder: ${error.message}`);
    }
  };

  getFolders = async (userId: string): Promise<IFolder[]> => {
    try {
      const folders = await this.folderRepository.getFolders(userId);
      logger.info(
        `FolderService: getFolders success for user ${userId}, found ${folders.length} folders`
      );
      return folders;
    } catch (error: any) {
      logger.error(`FolderService: getFolders error: ${error.message}`);
      throw new Error(`Failed to get folders: ${error.message}`);
    }
  };

  getFolderWithPosts = async (
    id: string,
    userId: string
  ): Promise<IFolder & { posts: IPost[] }> => {
    try {
      const [folder, posts] = await Promise.all([
        this.folderRepository.getFolder(id, userId),
        this.postRepository.getPosts(userId, { folderId: id }),
      ]);

      const folderWithPosts = {
        ...folder,
        posts,
      };

      logger.info(`FolderService: getFolderWithPosts success for folder ${id}`);
      return folderWithPosts;
    } catch (error: any) {
      logger.error(`FolderService: getFolderWithPosts error: ${error.message}`);
      throw new Error(`Failed to get folder with posts: ${error.message}`);
    }
  };
}
