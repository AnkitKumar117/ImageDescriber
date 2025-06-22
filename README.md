# Sploot Assessment - Image Upload API

This is a Node.js/Express application that handles image uploads, processes them with LLaVA (Large Language and Vision Assistant), and stores the results.

## Features

- **Image Upload**: Upload images with proper validation and storage
- **LLaVA Integration**: Process images using LLaVA API for image description
- **File Storage**: Images are stored in the `uploads/` folder with meaningful names
- **Database Storage**: Image metadata and processing results stored in MongoDB
- **API Endpoints**: RESTful API for uploading and retrieving images

## File Storage Improvements

The application now properly stores images with the following improvements:

1. **Meaningful Filenames**: Files are stored with timestamps and original extensions
2. **File Type Validation**: Only image files are accepted
3. **File Size Limits**: 10MB maximum file size
4. **Original Name Preservation**: Original filename is stored in the database
5. **Error Handling**: Proper error handling for file operations

## API Endpoints

### Upload Image
```
POST /api/images/upload
Content-Type: multipart/form-data
Body: image file
```

**Response:**
```json
{
  "message": "Image processed successfully",
  "data": {
    "id": "image_id",
    "filename": "image-1234567890-123456789.jpg",
    "originalName": "my_image.jpg",
    "result": "LLaVA processing result",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get All Images
```
GET /api/images
```

### Get Image by ID
```
GET /api/images/:id
```

### Serve Image File
```
GET /api/images/file/:filename
```

## File Storage Structure

Images are stored in the `uploads/` folder with the following naming convention:
- Format: `image-{timestamp}-{random}.{extension}`
- Example: `image-1704067200000-123456789.jpg`

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# .env file
PORT=5000
MONGODB_URI=your_mongodb_connection_string
LLAVA_API_URL=your_llava_api_url
```

3. Start the server:
```bash
npm start
```

## Error Handling

The application includes comprehensive error handling for:
- Invalid file types
- File size limits
- Database errors
- LLaVA API errors
- File not found errors

## Security Features

- File type validation (images only)
- File size limits
- Proper error handling
- CORS enabled 