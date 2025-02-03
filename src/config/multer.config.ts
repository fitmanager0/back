import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerOptions = {
  limits: { fileSize: 2 * 1024 * 1024 }, // Máximo 2MB
  fileFilter: (req, file, callback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error('Tipo de archivo no permitido. Solo JPG, PNG, WEBP.'));
    }
  },
};
