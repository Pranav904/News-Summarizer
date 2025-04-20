# News Summarizer

## Purpose

The purpose of this project is to provide a platform for summarizing news articles. It fetches news articles from various sources, summarizes them, and provides relevant tags for easy categorization.

## Main Features

- Fetches news articles from multiple sources.
- Summarizes articles using Google Generative AI.
- Categorizes articles with relevant tags.
- Stores summarized articles in DynamoDB.
- Provides a user interface for viewing summarized articles.

## Technologies Used

- Next.js for the frontend.
- Google Generative AI for summarizing articles.
- AWS DynamoDB for storing summarized articles.
- AWS SQS for message queuing.
- NewsAPI for fetching news articles.

## Contributing

We welcome contributions from the community. To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes.
4. Submit a pull request with a detailed description of your changes.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
