const { MongoClient, ObjectId } = require('mongodb');

let client = null;
let db = null;

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-app';

async function connectDB() {
  try {
    client = new MongoClient(mongoUri);
    await client.connect();
    db = client.db('student-app');
    console.log('Connected to MongoDB');
    
    // Create collections if they don't exist
    await createCollections();
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

async function createCollections() {
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map(c => c.name);

  if (!collectionNames.includes('users')) {
    await db.createCollection('users');
  }
  if (!collectionNames.includes('classes')) {
    await db.createCollection('classes');
  }
  if (!collectionNames.includes('attendance')) {
    await db.createCollection('attendance');
    // Create index for faster queries
    await db.collection('attendance').createIndex({ classId: 1, date: 1 });
    await db.collection('attendance').createIndex({ studentId: 1, classId: 1 });
  }
}

function getDB() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

async function disconnectDB() {
  if (client) {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

module.exports = {
  connectDB,
  getDB,
  disconnectDB,
  ObjectId,
};
