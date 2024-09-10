import os
from dotenv import load_dotenv
import requests
import boto3
import schedule
import time
import json

# Load environment variables
load_dotenv()

NEWS_API_KEY = os.getenv('NEWS_API_KEY')
AWS_ACCESS_KEY = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_REGION = os.getenv('AWS_REGION')
SQS_QUEUE_URL = os.getenv('SQS_QUEUE_URL')

# Rest of your code remains the same

def fetch_news():
    url = f'https://newsapi.org/v2/top-headlines?country=us&apiKey={NEWS_API_KEY}&pageSize=2'
    response = requests.get(url)
    articles = response.json().get('articles', [])
    return articles

def push_to_sqs(articles):
    sqs = boto3.client('sqs', 
                       aws_access_key_id=AWS_ACCESS_KEY,
                       aws_secret_access_key=AWS_SECRET_KEY,
                       region_name=AWS_REGION)
    for article in articles:
        sqs.send_message(
            QueueUrl=SQS_QUEUE_URL,
            MessageBody=json.dumps(article)
        )
    print(f"Pushed {len(articles)} articles to SQS")

def job():
    articles = fetch_news()
    push_to_sqs(articles)

schedule.every(30).seconds.do(job)

if __name__ == "__main__":
    while True:
        schedule.run_pending()
        time.sleep(1)