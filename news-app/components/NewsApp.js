import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const NewsApp = () => {
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/articles${lastEvaluatedKey ? `?lastEvaluatedKey=${encodeURIComponent(lastEvaluatedKey)}` : ''}`);
      const data = await response.json();
      setArticles(prevArticles => [...prevArticles, ...data.articles]);
      setLastEvaluatedKey(data.lastEvaluatedKey);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleNextArticle = () => {
    if (currentIndex === articles.length - 2 && lastEvaluatedKey) {
      fetchArticles();
    }
    setCurrentIndex(prevIndex => prevIndex + 1);
  };

  const currentArticle = articles[currentIndex];

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-gray-100 flex items-center justify-center">
        <h1 className="text-6xl font-bold">NEWS</h1>
      </div>
      <div className="w-1/2 p-8 overflow-auto">
        {currentArticle ? (
          <Card className="w-full">
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
              <Button onClick={handleNextArticle} disabled={isLoading || (currentIndex === articles.length - 1 && !lastEvaluatedKey)} className="w-full">
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