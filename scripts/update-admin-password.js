/**
 * Script to update admin password
 * Run with: node scripts/update-admin-password.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      process.env[key.trim()] = value;
    }
  });
}

// Admin Schema
const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  role: String,
  createdAt: Date,
  lastLogin: Date
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

async function updateAdminPassword() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI or MONGO_URI is not defined in .env.local');
      process.exit(1);
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // New password
    const newPassword = 'BagAristo#@5193';

    // Find all admins (in case there are multiple)
    const admins = await Admin.find({});

    if (admins.length === 0) {
      console.log('⚠️  No admin found in database');
      console.log('Creating a new admin...');

      // Create a new admin if none exists
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      const newAdmin = new Admin({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@bookhaven.com',
        role: 'admin',
        createdAt: new Date()
      });

      await newAdmin.save();
      console.log('✅ New admin created successfully!');
      console.log('   Username: admin');
      console.log('   Email: admin@bookhaven.com');
      console.log('   Password: BagAristo#@5193');
    } else {
      console.log(`📋 Found ${admins.length} admin(s)`);

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update all admins
      for (const admin of admins) {
        admin.password = hashedPassword;
        await admin.save();

        console.log(`✅ Password updated for admin:`);
        console.log(`   Username: ${admin.username}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   New Password: BagAristo#@5193`);
      }
    }

    console.log('\n🎉 Admin password update completed successfully!');

  } catch (error) {
    console.error('❌ Error updating admin password:', error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the script
updateAdminPassword();
