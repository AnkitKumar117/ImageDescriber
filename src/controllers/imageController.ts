import { Request, Response } from 'express';
import ImageModel from '../models/image';
import { sendToLlava } from '../services/llavaService';

export const processImage = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

  const imagePath = req.file.path;
  const originalName = req.file.originalname;
  const filename = req.file.filename;
  const prompt = req.body.prompt || "Describe this image in detail as if explaining it to someone blind."; // or set a default prompt string
  const image = await ImageModel.create({
    filename: filename,
    file_originalname: originalName,
    status: 'pending',
    result: null,
  });

  res.json({
    message: 'Image computation is started. It will take a few seconds.',
    data: {
      id: image._id,
      filename: filename,
      originalName: originalName,
      status: image.status,
      description: null,
      createdAt: image.uploadedAt,
      completedAt: null,
    }
  });
  console.log('Image processing started:', image._id, filename, originalName);
  try {
    const result = await sendToLlava(imagePath, prompt);
    image.status = 'completed';
    image.completedAt = new Date();
    image.description = result;
    await image.save();
    console.log('Image processing completed:', image._id, filename, originalName);
    // res.json({ 
    //   message: 'Image processed successfully', 
    //   data: {
    //     id: image._id,
    //     filename: filename,
    //     originalName: originalName,
    //     description: result,
    //     status: image.status,
    //     uploadedAt: image.uploadedAt
    //   }
    // });
  } catch (error) {
    console.error('Error processing image:', error);
    image.status = 'failed';
    image.completedAt = new Date();
    image.description = error instanceof Error ? error.message : 'Error while computing image description';
    await image.save();
    // res.status(500).json({ error: 'Processing failed', details: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const getImages = async (_req: Request, res: Response) => {
  try {
    console.log('Fetching images from database...');
    const images = await ImageModel.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};

