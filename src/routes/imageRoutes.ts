import express, { NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { processImage, getImages } from '../controllers/imageController';

const router = express.Router();

// Configure multer for better file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Create a unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const allowedTypes = ['image/jpeg', 'image/png'];

const fileFilter = (req: any, file: any, cb: any) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    return cb(new Error('Only image(JPEG, PNG) files are allowed!') as unknown as null, false);
  }
};

const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: (_req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: fileFilter,
});

// Upload route
router.post('/upload', (req, res, next) => {
  upload.single('image')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Handle Multer-specific errors
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Max size is 5MB.' });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Handle general errors
      return res.status(400).json({ error: err.message });
    }

    // Proceed to controller
    Promise.resolve(processImage(req, res)).catch(next);
  });
});

// Route to serve individual images (must come before /:id route)
router.get('/file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../uploads', filename);
  
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({ error: 'Image not found' });
    }
  });
});

router.get('/', (req, res, next) => {
  // Fetch all images from the database
  Promise.resolve(getImages(req, res)).catch(next);
});


router.delete('/:id', (req, res, next) => {
  (async () => {
    try {
      console.log('Deleting image with ID:', req.params.id);
      const ImageModel = require('../models/image').default;
      const image = await ImageModel.findByIdAndDelete(req.params.id);
      if (!image) {
        return res.status(404).json({ error: 'Image not found' });
      }
      // Delete the file from uploads folder
      const filePath = path.join(__dirname, '../../uploads', image.filename);
      fs.unlink(filePath, (err) => {
        if (err && err.code !== 'ENOENT') {
          // Only log error if it's not file-not-found
          console.error('Error deleting file:', err);
        }
      });
      res.json({ message: 'Image and analysis deleted successfully' });
    } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).json({ error: 'Failed to delete image' });
    }
  })().catch(next);
});



export default router;
