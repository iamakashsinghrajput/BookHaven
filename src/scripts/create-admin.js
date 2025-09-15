// Script to create an admin user
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Admin schema (without import since this is a standalone script)
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'superadmin'],
    default: 'admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

async function createAdmin() {
  try {
    // Connect to MongoDB (you'll need to set your connection string)
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/my-library-app';
    await mongoose.connect(mongoUri);

    console.log('Connected to MongoDB');

    // Admin credentials
    const adminData = {
      username: 'admin',
      email: 'admin@bookhaven.com',
      password: 'BagFridge#@5193', // Change this to a secure password
      role: 'superadmin'
    };

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [
        { email: adminData.email },
        { username: adminData.username }
      ]
    });

    if (existingAdmin) {
      console.log('Admin already exists with username:', existingAdmin.username);
      process.exit(0);
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

    // Create admin
    const admin = new Admin({
      ...adminData,
      password: hashedPassword
    });

    await admin.save();

    console.log('Admin created successfully!');
    console.log('Username:', adminData.username);
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password, '(change this!)');
    console.log('Role:', adminData.role);

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();