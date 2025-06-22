const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

// Test the health endpoint
async function testHealth() {
  try {
    const response = await axios.post('http://localhost:5000/health');
    console.log('✅ Health check passed:', response.data);
  } catch (error) {
    console.error('❌ Health check failed:', error.response?.data || error.message);
  }
}

// Test image upload (you'll need to provide an actual image file)
async function testImageUpload() {
  try {
    // Create a simple test image (1x1 pixel PNG)
    const testImagePath = './test-image.png';
    
    // Check if test image exists, if not create a simple one
    if (!fs.existsSync(testImagePath)) {
      console.log('⚠️  No test image found. Please place an image file named "test-image.png" in the root directory.');
      console.log('   You can use any image file and rename it to "test-image.png"');
      return;
    }

    const form = new FormData();
    form.append('image', fs.createReadStream(testImagePath));

    const response = await axios.post('http://localhost:5000/api/images/upload', form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': 'Bearer test-token' // Add authorization header
      }
    });

    console.log('✅ Image upload successful:', response.data);
    
    // Test getting all images
    const imagesResponse = await axios.get('http://localhost:5000/api/images', {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    console.log('✅ Get images successful:', imagesResponse.data);
    
  } catch (error) {
    console.error('❌ Image upload failed:', error.response?.data || error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Testing Sploot Assessment API...\n');
  
  await testHealth();
  console.log('');
  
  await testImageUpload();
  console.log('\n✨ Tests completed!');
}

runTests(); 