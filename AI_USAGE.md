# AI Tool Usage Documentation

## Overview
This project integrates the LLaVA (Large Language and Vision Assistant) model to generate detailed image descriptions. The LLaVA API is called from the backend to process uploaded images and return a textual description.

## Integration Points
- The main integration is in `src/services/llavaService.ts`, where the function `sendToLlava` handles communication with the LLaVA API.
- The image upload and processing flow is managed in `src/controllers/imageController.ts`.

## How It Works
1. User uploads an image via the `/api/images/upload` endpoint.
2. The backend saves the image and triggers the `sendToLlava` function with the image path and a prompt.
3. The `sendToLlava` function encodes the image as base64 and sends a POST request to the LLaVA API endpoint specified by the `LLAVA_API_URL` environment variable.
4. The LLaVA API returns a description, which is saved in the database and associated with the image.

## LLaVA API Usage
- **Endpoint:** The LLaVA API endpoint is set via the `LLAVA_API_URL` environment variable (e.g., `http://localhost:11434/api/generate`).
- **Request:**
  - Method: `POST`
  - Body: JSON containing the base64-encoded image, prompt, and model name.
- **Response:**
  - JSON with a `response` field containing the generated description.

## Environment Variables
- `LLAVA_API_URL`: The URL of the LLaVA API server (local or remote).
- Example: `LLAVA_API_URL=http://localhost:11434/api/generate`

## Running LLaVA Locally
- To use LLaVA locally, install and run the model using Ollama:
  ```bash
  ollama pull llama3.2-vision
  ollama serve
  ```
- Ensure the API is accessible at the URL specified in your `.env` file.

## Development & Testing Notes
- You can test the LLaVA integration by uploading images via the API and checking the generated descriptions in the database or API responses.
- If the LLaVA API is unavailable, image processing will fail and the error will be logged and saved in the image record.
- You can change the prompt sent to LLaVA by including a `prompt` field in the upload request.

## Additional AI & Productivity Tools Used

### GitHub Copilot
- Used for code autocompletion, generating boilerplate, and suggesting code improvements directly in the editor.
- Helped accelerate development by providing context-aware code suggestions and inline documentation.

### Cursor
- Used as the primary code editor, leveraging its AI-powered features for code navigation, refactoring, and in-editor chat for quick code explanations and modifications.
- Enabled efficient multi-file edits and rapid prototyping.

### ChatGPT
- Used for architectural guidance, code review, and generating documentation.
- Assisted in debugging, brainstorming solutions, and clarifying best practices for API design and integration.

### Warp Terminal
- Used as the main terminal for running development commands, managing processes, and interacting with Git.
- Provided enhanced productivity features like command history, block-based output, and AI command search.

## References
- [LLaVA GitHub Repository](https://github.com/haotian-liu/LLaVA)
- [Ollama Documentation](https://ollama.com/)
- [GitHub Copilot](https://github.com/features/copilot)
- [Cursor](https://www.cursor.so/)
- [ChatGPT](https://chat.openai.com/)
- [Warp Terminal](https://www.warp.dev/) 