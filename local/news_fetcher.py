import os
import requests
import boto3
import json
import time
import urllib.parse
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Environment Variables from GitHub Actions Secrets
NEWS_API_KEY = os.getenv('NEWS_API_KEY')
AWS_ACCESS_KEY = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_REGION = os.getenv('AWS_REGION')
SQS_QUEUE_URL = os.getenv('SQS_QUEUE_URL')

# List of tags to fetch articles for
TAGS = [
    "WorldNews", "Politics", "Economy", "Business", "Technology", 
    "Health", "Environment", "Science", "Education", "Sports",
    "Entertainment", "Culture", "Lifestyle", "Travel", "Crime", 
    "Opinion", "SocialIssues", "Innovation", "HumanRights", "Weather"
]

BATCH_SIZE = 20  # Number of articles to send to SQS for each tag
processed_articles = set()  # To track processed article URLs

def fetch_news(tag):
    """Fetches news articles for a given tag using NewsAPI."""
    articles = []
    page = 1

    while len(articles) < BATCH_SIZE:
        url = "https://newsapi.org/v2/everything"
        params = {
            "q": urllib.parse.quote(tag),
            "language": "en",
            "sortBy": "publishedAt",
            "pageSize": BATCH_SIZE,
            "page": page,
            "apiKey": NEWS_API_KEY
        }

        try:
            response = requests.get(url, params=params)
            response.raise_for_status()  # Raise HTTPError for bad responses

            data = response.json()
            if "articles" not in data:
                print(f"⚠️ No articles found for tag: {tag}")
                break

            articles.extend(data["articles"])
            total_results = data.get("totalResults", 0)

            if len(articles) >= total_results or len(articles) >= BATCH_SIZE:
                break

            page += 1
        except requests.exceptions.RequestException as e:
            print(f"❌ Error fetching news for tag '{tag}': {e}")
            break

    return articles[:BATCH_SIZE]

def push_to_sqs(articles, tag):
    """Pushes fetched articles to AWS SQS queue."""
    sqs = boto3.client("sqs",
                       aws_access_key_id=AWS_ACCESS_KEY,
                       aws_secret_access_key=AWS_SECRET_KEY,
                       region_name=AWS_REGION)

    new_articles = [article for article in articles if article["url"] not in processed_articles]

    for article in new_articles:
        try:
            sqs.send_message(
                QueueUrl=SQS_QUEUE_URL,
                MessageBody=json.dumps(article)
            )
            processed_articles.add(article["url"])
        except Exception as e:
            print(f"❌ Failed to push article to SQS: {e}")

    print(f"✅ Pushed {len(new_articles)} new articles to SQS for tag '{tag}'.")

def main():
    """Main function to fetch news and push to SQS."""
    print("🚀 Starting news fetch job...")
    
    for tag in TAGS:
        print(f"🔍 Fetching articles for: {tag}")
        articles = fetch_news(tag)
        push_to_sqs(articles, tag)
        time.sleep(90)  # Prevent hitting API rate limits

    print("🎉 News fetch job completed!")

if __name__ == "__main__":
    main()
