import { NextResponse } from 'next/server';
const AWS = require('aws-sdk');

async function checkDatabaseConnection() {
  // Check DynamoDB connection
  const dynamoDB = new AWS.DynamoDB({
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });
  
  try {
    await dynamoDB.listTables().promise();
    return true;
  } catch (err) {
    console.error('DynamoDB connection error:', err);
    return false;
  }
}

export async function GET() {
  try {
    const databaseStatus = await checkDatabaseConnection();
    
    if (databaseStatus) {
      return NextResponse.json({ status: 'healthy' }, { status: 200 });
    } else {
      return NextResponse.json({ 
        status: 'unhealthy',
        details: { database: databaseStatus }
      }, { status: 503 });
    }
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}
