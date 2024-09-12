import json
import os
import boto3
import google.generativeai as genai
from datetime import datetime
import uuid

# Configure Google AI
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# Create the model
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ArticleSummaries')

def lambda_handler(event, context):
    for record in event['Records']:
        article_data = json.loads(record['body'])
        
        # Extract content for summarization
        content_to_summarize = article_data['url']
        
        # Call Google AI Studio for summarization
        summary = summarize_article(content_to_summarize)
        
        # Prepare item for DynamoDB
        item = {
            'id': str(uuid.uuid4()),
            'messageReceivedTimestamp': int(record['attributes']['SentTimestamp']),
            'messageProcessedTimestamp': int(datetime.now().timestamp() * 1000),
            'url': article_data['url'],
            'summary': summary,
            'title': article_data['title'],
            'author': article_data.get('author', 'Unknown'),
            'publishDate': int(datetime.fromisoformat(article_data['publishedAt'].replace('Z', '+00:00')).timestamp() * 1000),
            'contentLength': len(summary),
            'language': 'en',  # Assuming English, you might want to detect this
            'imageUrl': article_data.get('urlToImage', ''),
            'status': 'processed'
        }
        
        # Save to DynamoDB
        table.put_item(Item=item)
        
        print(f"Processed article: {item['title']}")

def summarize_article(content):
    prompt = [
        "Summarize the given news article in under 90 words.",
        content
    ]
    response = model.generate_content(prompt)
    return response.text