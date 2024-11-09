import os
from dotenv import load_dotenv
import requests
import boto3
import time
import json
import urllib.parse
import schedule  # Added for scheduling

# Load environment variables
load_dotenv()

NEWS_API_KEY = os.getenv('NEWS_API_KEY')
AWS_ACCESS_KEY = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_REGION = os.getenv('AWS_REGION')
SQS_QUEUE_URL = os.getenv('SQS_QUEUE_URL')

# List of tags to fetch articles for
TAGS = [
    "World News", "Politics", "Economy", "Business", "Technology", 
    "Health", "Environment", "Science", "Education", "Sports",
    "Entertainment", "Culture", "Lifestyle", "Travel", "Crime", 
    "Opinion", "Social Issues", "Innovation", "Human Rights", "Weather"
]

BATCH_SIZE = 20  # Number of articles to send to SQS for each tag
processed_articles = set()  # To track processed article URLs

def fetch_news(tag):
    articles = []
    page = 1
    while len(articles) < BATCH_SIZE:
        url = f'https://newsapi.org/v2/everything'
        params = {
            'q': urllib.parse.quote(tag),  # URL-encode the tag as the query
            'language': 'en',  # Desired language
            'sortBy': 'publishedAt',  # Sort by published date
            'pageSize': BATCH_SIZE,  # Fetch up to BATCH_SIZE articles at a time
            'page': page,
            'apiKey': NEWS_API_KEY
        }
        
        response = requests.get(url, params=params)
        if response.status_code != 200:
            print(f"Error fetching news for tag '{tag}':", response.json())
            break
        
        data = response.json()
        articles.extend(data.get('articles', []))
        total_results = data.get('totalResults', 0)
        
        # Stop if we have enough articles or if we've reached the total available
        if len(articles) >= total_results or len(articles) >= BATCH_SIZE:
            break
        
        page += 1

    return articles[:BATCH_SIZE]  # Return only up to BATCH_SIZE articles

def push_to_sqs(articles, tag):
    sqs = boto3.client('sqs', 
                       aws_access_key_id=AWS_ACCESS_KEY,
                       aws_secret_access_key=AWS_SECRET_KEY,
                       region_name=AWS_REGION)
    
    new_articles = [article for article in articles if article['url'] not in processed_articles]

    for article in new_articles:  # Send articles to SQS
        sqs.send_message(
            QueueUrl=SQS_QUEUE_URL,
            MessageBody=json.dumps(article)
        )
        processed_articles.add(article['url'])  # Mark article as processed

    print(f"Pushed {len(new_articles)} new articles to SQS for tag {tag}.")

def job():
    for tag in TAGS:
        articles = fetch_news(tag)
        push_to_sqs(articles, tag)
        time.sleep(90)  # Wait for 90 seconds before processing the next tag

# Schedule the job to run every 15 minutes
schedule.every(5).minutes.do(job)

if __name__ == "__main__":
    while True:
        schedule.run_pending()  # Check if any scheduled jobs are pending and run them
        time.sleep(1)  # Short sleep to reduce CPU usage
