/* ============================================================
   DIAGNOSTIC SCRIPT - Check what's wrong
   ============================================================ */

const fs = require('fs');
const path = require('path');

console.log('\n╔════════════════════════════════════════════════════╗');
console.log('║                                                    ║');
console.log('║           DIAGNOSTIC CHECK                         ║');
console.log('║                                                    ║');
console.log('╚════════════════════════════════════════════════════╝\n');

const issues = [];
const warnings = [];

// Check 1: .env file exists
console.log('1. Checking .env file...');
if (!fs.existsSync('.env')) {
  issues.push('❌ .env file not found! Create it from .env.example');
} else {
  console.log('   ✅ .env file exists');
  
  // Check .env contents
  const envContent = fs.readFileSync('.env', 'utf8');
  const requiredVars = [
    'MONGODB_URI',
    'ADMIN_USERNAME',
    'ADMIN_PASSWORD',
    'JWT_SECRET',
    'SESSION_SECRET'
  ];
  
  requiredVars.forEach(varName => {
    if (!envContent.includes(varName)) {
      issues.push(`❌ Missing ${varName} in .env file`);
    } else if (envContent.includes(`${varName}=`)) {
      const line = envContent.split('\n').find(l => l.startsWith(varName));
      const value = line?.split('=')[1]?.trim();
      if (!value || value === 'your-' || value === 'change-this') {
        warnings.push(`⚠️  ${varName} needs to be configured in .env`);
      } else {
        console.log(`   ✅ ${varName} is set`);
      }
    }
  });
}

// Check 2: package.json exists
console.log('\n2. Checking package.json...');
if (!fs.existsSync('package.json')) {
  issues.push('❌ package.json not found!');
} else {
  console.log('   ✅ package.json exists');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Check dependencies
  const requiredDeps = [
    'express',
    'mongoose',
    'bcryptjs',
    'jsonwebtoken',
    'cors',
    'helmet',
    'multer',
    'nodemailer'
  ];
  
  requiredDeps.forEach(dep => {
    if (!pkg.dependencies || !pkg.dependencies[dep]) {
      issues.push(`❌ Missing dependency: ${dep}`);
    }
  });
}

// Check 3: node_modules exists
console.log('\n3. Checking node_modules...');
if (!fs.existsSync('node_modules')) {
  issues.push('❌ node_modules not found! Run: npm install');
} else {
  console.log('   ✅ node_modules exists');
}

// Check 4: Required model files
console.log('\n4. Checking model files...');
const models = ['Admin.js', 'Project.js', 'Poem.js', 'Book.js', 'BlogPost.js'];
models.forEach(model => {
  const modelPath = path.join('models', model);
  if (!fs.existsSync(modelPath)) {
    issues.push(`❌ Missing model: ${modelPath}`);
  } else {
    console.log(`   ✅ ${model} exists`);
  }
});

// Check 5: Required page files
console.log('\n5. Checking page files...');
const pages = ['work.js', 'musings.js', 'shelf.js'];
pages.forEach(page => {
  const pagePath = path.join('pages', page);
  if (!fs.existsSync(pagePath)) {
    issues.push(`❌ Missing page: ${pagePath}`);
  } else {
    console.log(`   ✅ ${page} exists`);
  }
});

// Check 6: Main server file
console.log('\n6. Checking server file...');
if (!fs.existsSync('cms-server.js')) {
  issues.push('❌ cms-server.js not found!');
} else {
  console.log('   ✅ cms-server.js exists');
}

// Check 7: HTML files
console.log('\n7. Checking HTML files...');
const htmlFiles = ['index.html', 'work.html', 'musings.html', 'shelf.html', 'now.html', 'contact.html', 'admin.html'];
htmlFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    issues.push(`❌ Missing HTML file: ${file}`);
  } else {
    console.log(`   ✅ ${file} exists`);
  }
});

// Check 8: MongoDB connection (if mongoose is available)
console.log('\n8. Checking MongoDB connection...');
try {
  require('dotenv').config();
  const mongoose = require('mongoose');
  
  if (!process.env.MONGODB_URI) {
    warnings.push('⚠️  MONGODB_URI not set in .env');
  } else if (process.env.MONGODB_URI.includes('localhost')) {
    warnings.push('⚠️  Using localhost MongoDB - make sure MongoDB is running');
    console.log('   Run: mongod');
  } else {
    console.log('   ✅ MongoDB URI configured (Atlas)');
  }
} catch (error) {
  warnings.push('⚠️  Could not check MongoDB connection');
}

// Summary
console.log('\n╔════════════════════════════════════════════════════╗');
console.log('║                                                    ║');
console.log('║                   RESULTS                          ║');
console.log('║                                                    ║');
console.log('╚════════════════════════════════════════════════════╝\n');

if (issues.length === 0 && warnings.length === 0) {
  console.log('✅ ✅ ✅ ALL CHECKS PASSED! ✅ ✅ ✅\n');
  console.log('Your setup looks good! Try running:');
  console.log('  npm start\n');
} else {
  if (issues.length > 0) {
    console.log('🚨 CRITICAL ISSUES:\n');
    issues.forEach(issue => console.log(issue));
    console.log('');
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS:\n');
    warnings.forEach(warning => console.log(warning));
    console.log('');
  }
  
  console.log('📋 FIXES:\n');
  
  if (issues.some(i => i.includes('.env'))) {
    console.log('1. Create .env file:');
    console.log('   cp .env.example .env');
    console.log('   Then edit .env with your settings\n');
  }
  
  if (issues.some(i => i.includes('node_modules'))) {
    console.log('2. Install dependencies:');
    console.log('   npm install\n');
  }
  
  if (issues.some(i => i.includes('Missing dependency'))) {
    console.log('3. Install missing dependencies:');
    console.log('   npm install\n');
  }
  
  if (warnings.some(w => w.includes('MongoDB'))) {
    console.log('4. Start MongoDB:');
    console.log('   mongod');
    console.log('   Or use MongoDB Atlas (cloud)\n');
  }
}

console.log('For detailed setup instructions, see:');
console.log('  📖 COMPLETE_SETUP_GUIDE.md\n');
