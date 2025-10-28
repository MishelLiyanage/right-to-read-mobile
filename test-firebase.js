// Test Firebase Connection
// Run this with: node test-firebase.js

console.log('Testing Firebase configuration...');

// Check if google-services.json exists
const fs = require('fs');
const path = require('path');

const googleServicesPath = path.join(__dirname, 'google-services.json');
if (fs.existsSync(googleServicesPath)) {
  console.log('✅ google-services.json found');
  
  try {
    const googleServices = JSON.parse(fs.readFileSync(googleServicesPath, 'utf8'));
    console.log('✅ google-services.json is valid JSON');
    console.log(`📋 Project ID: ${googleServices.project_info.project_id}`);
    console.log(`📋 Storage Bucket: ${googleServices.project_info.storage_bucket}`);
    
    // Show what you need to update in firebaseEnvironment.ts
    console.log('\n🔧 Update your firebaseEnvironment.ts with these values:');
    console.log(`projectId: "${googleServices.project_info.project_id}"`);
    console.log(`storageBucket: "${googleServices.project_info.storage_bucket}"`);
    
    if (googleServices.project_info.project_number) {
      console.log(`messagingSenderId: "${googleServices.project_info.project_number}"`);
    }
    
  } catch (error) {
    console.log('❌ google-services.json is not valid JSON:', error.message);
  }
} else {
  console.log('❌ google-services.json not found');
  console.log('📥 Please download it from Firebase Console and place it in the project root');
}

console.log('\n📖 Next steps:');
console.log('1. Update config/firebaseEnvironment.ts with your project details');
console.log('2. Deploy Firestore security rules');
console.log('3. Test the analytics in your app');