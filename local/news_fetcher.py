import os
import sys
import requests
import boto3
import json
import time
import urllib.parse
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Fetch secrets properly
NEWS_API_KEY = os.getenv('NEWS_API_KEY')
AWS_ACCESS_KEY = os.getenv('AWS_ACCESS_KEY_ID')  # Fixed name
AWS_SECRET_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')  # Fixed name
AWS_REGION = os.getenv('AWS_REGION')
SQS_QUEUE_URL = os.getenv('SQS_QUEUE_URL')

# Validate required environment variables
missing_vars = [var for var in ["NEWS_API_KEY", "AWS_ACCESS_KEY", "AWS_SECRET_KEY", "AWS_REGION", "SQS_QUEUE_URL"] if not globals()[var]]
if missing_vars:
    print(f"❌ Missing required environment variables: {', '.join(missing_vars)}")
    sys.exit(1)  # Stop execution if secrets are missing

print("✅ All required environment variables are set.")

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
            "q": tag,
            "language": "en",
            "sortBy": "publishedAt",
            "pageSize": BATCH_SIZE,
            "page": page,
            "apiKey": NEWS_API_KEY
        }

        try:
            response = requests.get(url, params=params, timeout=15)  # Timeout added
            response.raise_for_status()
            data = response.json()

            if "articles" not in data:
                print(f"⚠️ No articles found for tag: {tag}")
                break

            articles.extend(data["articles"])
            if len(articles) >= min(data.get("totalResults", 0), BATCH_SIZE):
                break  # Stop when enough articles are collected

            page += 1
        except requests.exceptions.RequestException as e:
            print(f"❌ Error fetching news for tag '{tag}': {e}")
            break

    return articles[:BATCH_SIZE]

def push_to_sqs(articles, tag):
    """Pushes fetched articles to AWS SQS queue."""
    try:
        sqs = boto3.client("sqs",
                           aws_access_key_id=AWS_ACCESS_KEY,
                           aws_secret_access_key=AWS_SECRET_KEY,
                           region_name=AWS_REGION)

        new_articles = [article for article in articles if article["url"] not in processed_articles]
        if not new_articles:
            print(f"⚠️ No new articles to push for tag '{tag}'")
            return

        # Send articles in batch to reduce API calls
        for article in new_articles:
            sqs.send_message(
                QueueUrl=SQS_QUEUE_URL,
                MessageBody=json.dumps(article)
            )
            processed_articles.add(article["url"])

        print(f"✅ Pushed {len(new_articles)} new articles to SQS for tag '{tag}'.")

    except Exception as e:
        print(f"❌ Failed to push articles to SQS: {e}")

def main():
    """Main function to fetch news and push to SQS."""
    print("🚀 Starting news fetch job...")

    for tag in TAGS[:2]:
        print(f"🔍 Fetching articles for: {tag}")
        articles = fetch_news(tag)
        push_to_sqs(articles, tag)
        time.sleep(5)
    # articles = fetch_news(TAGS[0])
    # print(articles)
    print("🎉 News fetch job completed!")

if __name__ == "__main__":
    main()
