/* ============================================================
   SERVER TEST SCRIPT
   Quick test to verify your backend is working correctly
   ============================================================ */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

console.log('\n🧪 Testing Backend Server...\n');

// Test 1: Health Check
async function testHealth() {
  try {
    console.log('1️⃣  Testing health endpoint...');
    const response = await axios.get(`${BASE_URL}/api/health`);
    
    if (response.data.success) {
      console.log('   ✅ Health check passed!');
      console.log(`   📅 Server time: ${response.data.timestamp}\n`);
      return true;
    }
  } catch (error) {
    console.log('   ❌ Health check failed!');
    console.log(`   Error: ${error.message}\n`);
    return false;
  }
}

// Test 2: Contact Form
async function testContactForm() {
  try {
    console.log('2️⃣  Testing contact form...');
    const response = await axios.post(`${BASE_URL}/api/contact`, {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Message',
      message: 'This is a test message from the automated test script!'
    });
    
    if (response.data.success) {
      console.log('   ✅ Contact form test passed!');
      console.log(`   📧 ${response.data.message}\n`);
      return true;
    }
  } catch (error) {
    console.log('   ❌ Contact form test failed!');
    if (error.response) {
      console.log(`   Error: ${error.response.data.message}`);
      if (error.response.data.errors) {
        console.log(`   Details: ${error.response.data.errors.join(', ')}`);
      }
    } else {
      console.log(`   Error: ${error.message}`);
    }
    console.log('');
    return false;
  }
}

// Test 3: Anonymous Letter
async function testAnonymousLetter() {
  try {
    console.log('3️⃣  Testing anonymous letter...');
    const response = await axios.post(`${BASE_URL}/api/anonymous`, {
      message: 'This is a test anonymous message from the automated test script!',
      expectReply: false
    });
    
    if (response.data.success) {
      console.log('   ✅ Anonymous letter test passed!');
      console.log(`   🔒 ${response.data.message}\n`);
      return true;
    }
  } catch (error) {
    console.log('   ❌ Anonymous letter test failed!');
    if (error.response) {
      console.log(`   Error: ${error.response.data.message}`);
      if (error.response.data.errors) {
        console.log(`   Details: ${error.response.data.errors.join(', ')}`);
      }
    } else {
      console.log(`   Error: ${error.message}`);
    }
    console.log('');
    return false;
  }
}

// Test 4: Anonymous Letter with Reply
async function testAnonymousLetterWithReply() {
  try {
    console.log('4️⃣  Testing anonymous letter with reply option...');
    const response = await axios.post(`${BASE_URL}/api/anonymous`, {
      message: 'This is a test anonymous message requesting a reply!',
      expectReply: true,
      replyEmail: 'reply@example.com'
    });
    
    if (response.data.success) {
      console.log('   ✅ Anonymous letter with reply test passed!');
      console.log(`   📬 ${response.data.message}\n`);
      return true;
    }
  } catch (error) {
    console.log('   ❌ Anonymous letter with reply test failed!');
    if (error.response) {
      console.log(`   Error: ${error.response.data.message}`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
    console.log('');
    return false;
  }
}

// Test 5: Validation
async function testValidation() {
  try {
    console.log('5️⃣  Testing input validation...');
    const response = await axios.post(`${BASE_URL}/api/contact`, {
      name: 'A',
      email: 'invalid-email',
      message: 'Short'
    });
    
    console.log('   ❌ Validation test failed - should have rejected invalid input!\n');
    return false;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('   ✅ Validation test passed!');
      console.log('   🛡️  Server correctly rejected invalid input\n');
      return true;
    } else {
      console.log('   ❌ Unexpected error during validation test');
      console.log(`   Error: ${error.message}\n`);
      return false;
    }
  }
}

// Run all tests
async function runTests() {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║         BACKEND SERVER TEST SUITE                  ║');
  console.log('╚════════════════════════════════════════════════════╝\n');
  
  const results = {
    health: false,
    contact: false,
    anonymous: false,
    anonymousReply: false,
    validation: false
  };
  
  // Run tests sequentially
  results.health = await testHealth();
  
  if (results.health) {
    results.contact = await testContactForm();
    results.anonymous = await testAnonymousLetter();
    results.anonymousReply = await testAnonymousLetterWithReply();
    results.validation = await testValidation();
  } else {
    console.log('⚠️  Server is not running. Skipping remaining tests.\n');
    console.log('💡 Start the server with: npm start\n');
    process.exit(1);
  }
  
  // Summary
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║                  TEST SUMMARY                      ║');
  console.log('╚════════════════════════════════════════════════════╝\n');
  
  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;
  
  console.log(`   Health Check:              ${results.health ? '✅' : '❌'}`);
  console.log(`   Contact Form:              ${results.contact ? '✅' : '❌'}`);
  console.log(`   Anonymous Letter:          ${results.anonymous ? '✅' : '❌'}`);
  console.log(`   Anonymous with Reply:      ${results.anonymousReply ? '✅' : '❌'}`);
  console.log(`   Input Validation:          ${results.validation ? '✅' : '❌'}`);
  console.log('');
  console.log(`   Total: ${passed}/${total} tests passed\n`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Your backend is working perfectly!\n');
    console.log('📧 Check your email inbox for test messages.\n');
  } else {
    console.log('⚠️  Some tests failed. Please check the errors above.\n');
    console.log('💡 Common issues:');
    console.log('   - Make sure .env file is configured correctly');
    console.log('   - Verify SMTP credentials are valid');
    console.log('   - Check that the server is running on port 3000\n');
  }
  
  process.exit(passed === total ? 0 : 1);
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('\n❌ Unhandled error:', error.message);
  process.exit(1);
});

// Run tests
runTests();
