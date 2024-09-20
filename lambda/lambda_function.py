import json
import os
import boto3
import google.generativeai as genai
from google.ai.generativelanguage_v1beta.types import content
from datetime import datetime
import uuid

# Configure Google AI
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# Create the model
generation_config = {
  "temperature": 0.15,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_schema": content.Schema(
    type = content.Type.OBJECT,
    required = ["summary", "tags"],
    properties = {
      "summary": content.Schema(
        type = content.Type.STRING,
      ),
      "tags": content.Schema(
        type = content.Type.ARRAY,
        items = content.Schema(
          type = content.Type.STRING,
        ),
      ),
    },
  ),
  "response_mime_type": "application/json",
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
        
        # Extract article url for summarization
        article_url = article_data['url']
        
        # Call Google AI Studio for summarization
        summary,tags = summarize_article(article_url)
        
        # Prepare item for DynamoDB
        item = {
            'id': str(uuid.uuid4()),
            'messageReceivedTimestamp': int(record['attributes']['SentTimestamp']),
            'messageProcessedTimestamp': int(datetime.now().timestamp() * 1000),
            'url': article_data['url'],
            'summary': summary,
            'tags': tags,
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

def summarize_article(url):
    prompt = [
      "Summarize the given news article by accessing the given link in under 150 words. Select relevant tags from: World News, Politics, Economy, Business, Technology, Health, Environment, Science, Education, Sports, Entertainment, Culture, Lifestyle, Travel, Crime, Opinion, Social Issues, Innovation, Human Rights, Weather.",
      url
    ]
    response = model.generate_content(prompt)
    result = json.loads(response.text)
    summary = result.get("summary")
    tags = result.get("tags")
    return summary,tags