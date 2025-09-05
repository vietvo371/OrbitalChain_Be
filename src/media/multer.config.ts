import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const uploadDir = join(process.cwd(), 'uploads');

// Ensure upload directory exists
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

export const multerConfig: MulterOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const subDir = file.fieldname === 'avatar' ? 'avatars' : 'observations';
      const fullPath = join(uploadDir, subDir);
      
      if (!existsSync(fullPath)) {
        mkdirSync(fullPath, { recursive: true });
      }
      
      cb(null, fullPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1, // Only one file at a time
  },
};
