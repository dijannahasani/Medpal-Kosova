require('dotenv').config();
console.log('MongoDB URI:', process.env.MONGO_URI ? 'Found' : 'Not found');
console.log('Environment loaded successfully');