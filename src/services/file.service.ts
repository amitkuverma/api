import path from 'path';

const getUploadedFilePath = (file: Express.Multer.File) => {
  return path.join(__dirname, '../uploads', file.filename); // Return the file path
};

export { getUploadedFilePath };
