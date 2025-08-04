export interface IFolder {
  id: string;
  userId: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IFolderService {
  createFolder: (data: {
    name: string;
    description?: string;
    color?: string;
    userId: string;
  }) => Promise<IFolder>;
  updateFolder: (data: {
    id: string;
    name?: string;
    description?: string;
    color?: string;
    userId: string;
  }) => Promise<IFolder>;
  deleteFolder: (id: string, userId: string) => Promise<void>;
  getFolder: (id: string, userId: string) => Promise<IFolder>;
  getFolders: (userId: string) => Promise<IFolder[]>;
}
