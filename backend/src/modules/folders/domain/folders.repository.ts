import supabase from "../../../lib/supabase-client";
import logger from "../../../logger";
import { IFolderService, IFolder } from "./folders.interface";

export class FolderRepository implements IFolderService {
  createFolder = async (data: {
    name: string;
    description?: string;
    color?: string;
    userId: string;
  }): Promise<IFolder> => {
    const { data: insertData, error } = await supabase
      .from("folders")
      .insert({
        userId: data.userId,
        name: data.name,
        description: data.description,
        color: data.color || "#3B82F6",
        created_at: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      logger.error(`FolderRepository: createFolder error: ${error.message}`);
      throw new Error(`Error creating folder: ${error.message}`);
    }

    logger.info(
      `FolderRepository: createFolder success: ${JSON.stringify(insertData)}`
    );
    return this.mapDbFolderToInterface(insertData);
  };

  updateFolder = async (data: {
    id: string;
    name?: string;
    description?: string;
    color?: string;
    userId: string;
  }): Promise<IFolder> => {
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.color !== undefined) updateData.color = data.color;

    const { data: updatedData, error } = await supabase
      .from("folders")
      .update(updateData)
      .eq("id", data.id)
      .eq("userId", data.userId)
      .select()
      .single();

    if (error) {
      logger.error(`FolderRepository: updateFolder error: ${error.message}`);
      throw new Error(`Error updating folder: ${error.message}`);
    }

    logger.info(
      `FolderRepository: updateFolder success: ${JSON.stringify(updatedData)}`
    );
    return this.mapDbFolderToInterface(updatedData);
  };

  deleteFolder = async (id: string, userId: string): Promise<void> => {
    const { error } = await supabase
      .from("folders")
      .delete()
      .eq("id", id)
      .eq("userId", userId);

    if (error) {
      logger.error(`FolderRepository: deleteFolder error: ${error.message}`);
      throw new Error(`Error deleting folder: ${error.message}`);
    }

    logger.info(`FolderRepository: deleteFolder success for id: ${id}`);
  };

  getFolder = async (id: string, userId: string): Promise<IFolder> => {
    const { data, error } = await supabase
      .from("folders")
      .select("*")
      .eq("id", id)
      .eq("userId", userId)
      .single();

    if (error) {
      logger.error(`FolderRepository: getFolder error: ${error.message}`);
      throw new Error(`Error fetching folder: ${error.message}`);
    }

    logger.info(`FolderRepository: getFolder success: ${JSON.stringify(data)}`);
    return this.mapDbFolderToInterface(data);
  };

  getFolders = async (userId: string): Promise<IFolder[]> => {
    const { data, error } = await supabase
      .from("folders")
      .select("*")
      .eq("userId", userId)
      .order("created_at", { ascending: false });

    if (error) {
      logger.error(`FolderRepository: getFolders error: ${error.message}`);
      throw new Error(`Error fetching folders: ${error.message}`);
    }

    logger.info(
      `FolderRepository: getFolders success: ${data?.length} folders fetched`
    );
    return data?.map(this.mapDbFolderToInterface) || [];
  };

  private mapDbFolderToInterface = (dbFolder: any): IFolder => {
    return {
      id: dbFolder.id,
      userId: dbFolder.userId,
      name: dbFolder.name,
      description: dbFolder.description,
      color: dbFolder.color,
      createdAt: dbFolder.created_at,
      updatedAt: dbFolder.updatedAt,
    };
  };
}
