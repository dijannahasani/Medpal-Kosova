#!/usr/bin/env node
const axios = require('axios');

// Test DELETE endpoint
async function testDeleteEndpoint() {
  try {
    // First, let's test with a fake ID to see if the endpoint exists
    const fakeId = '507f1f77bcf86cd799439011'; // Valid ObjectId format but fake
    
    const response = await axios.delete(`http://localhost:5000/api/documents/${fakeId}`, {
      headers: {
        'Authorization': 'Bearer fake-token-for-test'
      }
    });
    
    console.log('Response:', response.data);
  } catch (error) {
    console.log('Status:', error.response?.status);
    console.log('Data:', error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('✅ Endpoint exists but requires authentication (expected)');
    } else if (error.response?.status === 404) {
      console.log('❌ Endpoint not found - route not registered properly');
    } else {
      console.log('✅ Endpoint exists, got other error (expected for fake data)');
    }
  }
}

testDeleteEndpoint();