const express = require("express");
const cors = require("cors"); 
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

require("dotenv").config();

// Validate environment variables
const requiredEnvVars = [
  'AWS_REGION',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'DYNAMODB_TABLE_NAME'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1); 
  }
}

const port = process.env.PORT || 3000;

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

const app = express();

// Enable CORS for your React frontend's origin
const corsOptions = {
  origin: 'http://localhost:3001', // Replace with your frontend's actual origin
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));

app.get("/api/articles", async (req, res) => {
  try {
    // 1. Perform a Scan operation to get a larger subset of articles
    const subsetSize = 20; // Adjust this based on your table size and desired randomness
    const scanParams = {
      TableName: TABLE_NAME,
      Limit: subsetSize, 
    };
    const scanCommand = new ScanCommand(scanParams);
    const scanData = await docClient.send(scanCommand);

    // 2. Client-side filtering to select 5 random articles from the subset
    const subsetArticles = scanData.Items;
    const randomArticles = [];
    while (randomArticles.length < 5 && subsetArticles.length > 0) {
      const randomIndex = Math.floor(Math.random() * subsetArticles.length);
      randomArticles.push(subsetArticles.splice(randomIndex, 1)[0]); 
    }
    console.log("Request fulfilled !");
    res.json({
      articles: randomArticles,
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ error: "An error occurred while fetching articles" });
  }
});

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Backend server ready on http://localhost:${port}`);
});