# Image Upload API

This is a Node.js/Express + TypeScript application that handles image uploads, processes them with LLaVA (Large Language and Vision Assistant), and stores the results in MongoDB.

## Tech Stack
- **Node.js** + **Express** (REST API)
- **TypeScript**
- **Mongoose** (MongoDB ODM)
- **Multer** (file uploads)
- **LLaVA API** (image-to-text processing)
- **CORS** enabled

## Local Setup

Follow these steps to set up and run the project locally:

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) instance (local or cloud)
- [LLaVA API](https://github.com/haotian-liu/LLaVA) (local or cloud)

### 0. Install MongoDB (if running locally)
- **macOS (Homebrew):**
  ```bash
  brew tap mongodb/brew
  brew install mongodb-community@7.0
  brew services start mongodb-community@7.0
  ```
- **Ubuntu:**
  ```bash
  sudo apt-get update
  sudo apt-get install -y mongodb
  sudo systemctl start mongodb
  sudo systemctl enable mongodb
  ```
- **Windows:**
  - Download and install from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

### 0.1. Run LLaVA API Locally (optional)
- Install LLaVA locally (for specifc 3.2 version `ollama pull llama3.2-vision`)
- Run using `ollama serve`
- Set `LLAVA_API_URL` in your `.env` to your local LLaVA endpoint (e.g., `http://localhost:11434/api/generate`)

### 1. Clone the repository
```bash
git clone <repository-url>
cd ImageDescriber
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory and add the following:
```env
PORT=7009
MONGODB_URI=your_mongodb_connection_string
LLAVA_API_URL=your_llava_api_url
```
- Replace `your_mongodb_connection_string` with your MongoDB URI e.g `mongodb://localhost:27017/sploot_db`.
- Replace `your_llava_api_url` with your LLaVA API endpoint e.g `http://localhost:11434/api/generate`.

### 4. Start the server
```bash
npx ts-node-dev src/server.ts
```
The server will run on `http://localhost:7009` by default.

## Features

- **Image Upload**: Upload images with validation and storage
- **LLaVA Integration**: Process images using LLaVA API for image description
- **File Storage**: Images are stored in the `uploads/` folder with meaningful names
- **Database Storage**: Image metadata and processing results stored in MongoDB
- **API Endpoints**: RESTful API for uploading, retrieving, and deleting images
- **Prompt Customization**: Optionally provide a custom prompt for image description

## File Storage

The application stores images with the following features:

1. **Meaningful Filenames**: Files are stored with timestamps and original extensions
2. **File Type Validation**: Only JPEG and PNG image files are accepted
3. **File Size Limits**: 5MB maximum file size
4. **Original Name Preservation**: Original filename is stored in the database
5. **Error Handling**: Proper error handling for file operations

## API Endpoints

### Upload Image
```
POST /api/images/upload
Content-Type: multipart/form-data
Body: image file (field name: image), optional field: prompt
```

**Response:**
```
{
  "message": "Image computation is started. It will take a few seconds.",
  "data": {
    "id": "image_id",
    "filename": "image-1234567890-123456789.jpg",
    "originalName": "my_image.jpg",
    "status": "pending",
    "description": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "completedAt": null
  }
}
```
- The image is processed asynchronously. The description will be available after processing completes.
- You can provide a custom prompt for the image description by including a `prompt` field in the form data.

### Get All Images
```
GET /api/images
```
Returns a list of all images and their metadata.


### Delete Image
```
DELETE /api/images/:id
```
Deletes the image and its analysis from the database and removes the file from storage.

## API Usage with curl

Here are example `curl` commands for testing the main API endpoints:

### Health Check
```bash
curl --location --request POST 'localhost:7005/health'
```

### Get All Images
```bash
curl --location 'http://localhost:7009/api/images' \
--header 'Authorization: Bearer your-token'
```

### Delete an Image
```bash
curl --location --request DELETE 'http://localhost:7009/api/images/ID' \
--header 'Authorization: Bearer your-token'
```

### Upload an Image
```bash
curl --location 'http://localhost:7009/api/images/upload' \
--form 'image=@"/Users/ankit/Desktop/Screenshot 2025-06-21 at 14.36.53.png"'
```

- Replace `your-token` with your actual Bearer token if authentication is enabled.
- Replace `ID` with the image ID you want to delete.
- Update the image path in the upload command to point to an image on your system.

## File Storage Structure

Images are stored in the uploads folder