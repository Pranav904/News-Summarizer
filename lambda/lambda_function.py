import json
import os
import boto3
import google.generativeai as genai
from datetime import datetime
import logging
from hashlib import sha256
from botocore.exceptions import ClientError  # Correct import for ClientError

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()

# Configure Google AI
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Google AI Model Configuration
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config={
        "temperature": 0.15,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 8192,
        "response_mime_type": "application/json",
    }
)

# Initialize DynamoDB client and table outside the handler to avoid reinitialization
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ArticleSummaries')


def generate_article_id(url):
    """Generate a unique, consistent article ID based on the article URL."""
    return sha256(url.encode('utf-8')).hexdigest()  # Use SHA-256 to hash the URL


def lambda_handler(event, context):
    """Main Lambda Handler to process SQS messages and summarize articles"""
    records_to_write = []
    
    for record in event['Records']:
        try:
            # Parse SQS message
            article_data = json.loads(record['body'])
            
            # Extract article URL and other details
            article_url = article_data['url']
            title = article_data.get('title', 'Untitled')
            author = article_data.get('author', 'Unknown')
            publish_date = article_data.get('publishedAt')
            publish_timestamp = int(datetime.fromisoformat(publish_date.replace('Z', '+00:00')).timestamp() * 1000)

            # Summarize article and extract tags
            summary, tags = summarize_article(article_url)
            
            if not tags or summary in ["Summary not available", "Unable to generate summary"]:
                logger.info(f"Skipping article: {title}. Reason: Empty summary or tags.")
                continue
            
            # Prepare item for DynamoDB
            item = {
                'id': generate_article_id(article_url),  # Generate ID based on URL
                'messageReceivedTimestamp': int(record['attributes']['SentTimestamp']),
                'messageProcessedTimestamp': int(datetime.now().timestamp() * 1000),
                'url': article_url,
                'summary': summary,
                'tags': tags,
                'title': title,
                'author': author,
                'publishDate': publish_timestamp,
                'contentLength': len(summary),
                'language': 'en',  # Assuming English
                'imageUrl': article_data.get('urlToImage', ''),
                'status': 'processed'
            }
            
            records_to_write.append(item)
            logger.info(f"Processed article: {title}")

        except Exception as e:
            logger.error(f"Error processing record: {record}. Error: {str(e)}")
            continue
    
    # Batch write to DynamoDB
    if records_to_write:
        write_to_dynamodb(records_to_write)


def summarize_article(url):
    """Summarize the article using Google Generative AI"""
    prompt = [
      "Summarize the given news article by accessing the given link in under 150 words. Select relevant tags from: World News, Politics, Economy, Business, Technology, Health, Environment, Science, Education, Sports, Entertainment, Culture, Lifestyle, Travel, Crime, Opinion, Social Issues, Innovation, Human Rights, Weather.",
      url
    ]

    try:
        response = model.generate_content(prompt)
        result = json.loads(response.text)
        summary = result.get("summary", "Summary not available")
        tags = result.get("tags", [])
        return summary, tags

    except Exception as e:
        logger.error(f"Failed to summarize article at {url}: {str(e)}")
        return "Unable to generate summary", []


def write_to_dynamodb(items):
    """Batch write items to DynamoDB table with conditional uniqueness check."""
    with table.batch_writer() as batch:
        for item in items:
            try:
                table.put_item(
                    Item=item,
                    ConditionExpression="attribute_not_exists(id)"  # Ensure item is unique by id
                )
            except ClientError as e:
                # Handle duplicate error, log and continue
                if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
                    logger.warning(f"Duplicate article detected, skipping: {item['url']}")
                else:
                    raise e  # Raise other exceptions as needed

    logger.info(f"Successfully wrote unique items to DynamoDB")
