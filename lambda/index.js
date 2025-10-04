const { MongoClient } = require('mongodb');

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 10000
  });
  await client.connect();
  const db = client.db('neuralgrid');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

exports.handler = async (event) => {
  console.log('Event received:', JSON.stringify(event, null, 2));
  
  const { httpMethod, path, body, headers } = event;
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'CORS preflight' })
    };
  }

  try {
    // Handle health check
    if (path === '/health' || path === '/api/health' || path === '/signup' && httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ 
          status: 'OK', 
          timestamp: new Date().toISOString(),
          environment: 'lambda',
          path: path,
          method: httpMethod
        })
      };
    }

    // Handle signup
    if (path === '/signup' && httpMethod === 'POST') {
      const { db } = await connectToDatabase();
      const data = JSON.parse(body || '{}');
      
      console.log('Signup data:', data);
      
      // Validation
      if (!data.name || !data.email || !data.userType) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            message: 'Name, email, and user type are required'
          })
        };
      }

      // Check if user already exists
      const existingUser = await db.collection('users').findOne({ email: data.email });
      if (existingUser) {
        return {
          statusCode: 409,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            message: 'User with this email already exists'
          })
        };
      }

      // Create new user
      const user = {
        name: data.name,
        email: data.email.toLowerCase(),
        userType: data.userType,
        category: data.category || '',
        feedback: data.feedback || '',
        referrer: data.referrer || '',
        createdAt: new Date(),
        ipAddress: headers['x-forwarded-for'] || headers['x-real-ip'] || 'unknown',
        userAgent: headers['user-agent'] || 'unknown'
      };

      await db.collection('users').insertOne(user);
      console.log('User created successfully:', user.email);

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          message: 'Registration successful! We will contact you soon with your free tokens.'
        })
      };
    }

    // Default response
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Lambda function is working',
        path: path,
        method: httpMethod,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Lambda error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false, 
        message: 'Internal Server Error',
        error: error.message 
      })
    };
  }
};