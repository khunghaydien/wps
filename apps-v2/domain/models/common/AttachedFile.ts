export type AttachedFile = {
  attachedFileCreatedDate?: string;
  attachedFileDataType: string;
  attachedFileExtension?: string;
  attachedFileId: string;
  attachedFileName: string;
  attachedFileVerId: string;
};

export type AttachedFiles = Array<AttachedFile>;
