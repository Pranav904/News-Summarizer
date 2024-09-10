import json
import os
import boto3
import google.generativeai as genai

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

def lambda_handler(event, context):
    for record in event['Records']:
        article = json.loads(record['body'])
        
        # Call Google AI Studio for summarization
        summary = summarize_article(article['content'])
        
        # Here you would typically save to a database
        # For now, we'll just print the summary
        print(f"Title: {article['title']}")
        print(f"Summary: {summary}")
        print(f"URL: {article['url']}")
        print("---")

def summarize_article(content):
    prompt = [
        "Summarize the given news article in under 90 words.",
        f"input: {content}",
        "summary: ",
    ]
    response = model.generate_content(prompt)
    return response.text