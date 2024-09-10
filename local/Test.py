"""
Install the Google AI Python SDK

$ pip install google-generativeai
"""

import os
import google.generativeai as genai

genai.configure(api_key='AIzaSyDbc8I_yPOrID4xkapZMHGwdYZjYYI-01s')

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
  # safety_settings = Adjust safety settings
  # See https://ai.google.dev/gemini-api/docs/safety-settings
)

url = input("Enter the URL of the news article: ")

response = model.generate_content([
  "Summarize the given news article from the url given in under 90 words.",
  url
])
print(response)
print("-------------------")
print(response.text)