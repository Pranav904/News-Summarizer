import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';

const NewsApp = () => {
  const [articlesData, setArticlesData] = useState({
    articles: [],
    lastEvaluatedKey: null,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchArticles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/articles${articlesData.lastEvaluatedKey ? `?lastEvaluatedKey=${encodeURIComponent(articlesData.lastEvaluatedKey)}` : ''}`);
      const data = await response.json();
      setArticlesData(prevState => ({
        articles: [...prevState.articles, ...data.articles],
        lastEvaluatedKey: data.lastEvaluatedKey,
      }));
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Failed to load articles. Please try again later.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleNextArticle = () => {
    if (currentIndex === articlesData.articles.length - 2 && articlesData.lastEvaluatedKey) {
      fetchArticles();
    }
    setCurrentIndex(prevIndex => prevIndex + 1);
  };

  const currentArticle = articlesData.articles[currentIndex];

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-gray-100 flex items-center justify-center">
        <h1 className="text-6xl font-bold">NEWS</h1>
      </div>
      <div className="w-1/2 p-8 overflow-auto">
        {error && <p className="text-red-500">{error}</p>}
        {currentArticle ? (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-2">{currentArticle.title}</h2>
              <p className="text-sm text-gray-500 mb-4">
                By {currentArticle.author} | Published on {new Date(currentArticle.publishDate).toLocaleDateString()}
              </p>
              <p className="mb-4">{currentArticle.summary}</p>
              {currentArticle.imageUrl && (
                <img src={currentArticle.imageUrl} alt={currentArticle.title} className="w-full h-48 object-cover mb-4" />
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleNextArticle} 
                disabled={isLoading || (currentIndex === articlesData.articles.length - 1 && !articlesData.lastEvaluatedKey)}
                className="w-full"
              >
                {isLoading ? 'Loading...' : 'Next Article'}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <p>Loading articles...</p>
        )}
      </div>
    </div>
  );
};

export default NewsApp;