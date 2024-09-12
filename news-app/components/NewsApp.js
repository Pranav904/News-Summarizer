import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styles from '../styles/NewsApp.module.css'; // Updated CSS module import

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
      {/* Left side with gradient and text */}
      <div className="w-1/2 bg-gradient-to-b from-black to-gray-800 flex items-center justify-center">
        <h1 className="text-7xl font-bold text-white">NEWS</h1>
      </div>
      
      {/* Right side with the news cards */}
      <div className="w-1/2 p-8 overflow-auto">
        {error && <p className="text-red-500">{error}</p>}
        <TransitionGroup>
          {currentArticle && (
            <CSSTransition key={currentIndex} timeout={500} classNames={{
              enter: styles.fadeEnter,
              enterActive: styles.fadeEnterActive,
              exit: styles.fadeExit,
              exitActive: styles.fadeExitActive,
            }}>
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-3xl font-bold mb-2">{currentArticle.title}</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    By {currentArticle.author} | Published on {new Date(currentArticle.publishDate).toLocaleDateString()}
                  </p>
                  {currentArticle.imageUrl && (
                    <img src={currentArticle.imageUrl} alt={currentArticle.title} className="w-full h-64 object-cover mb-4 rounded-lg" />
                  )}
                  <p className="text-lg">{currentArticle.summary}</p>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button 
                    onClick={handleNextArticle} 
                    disabled={isLoading || (currentIndex === articlesData.articles.length - 1 && !articlesData.lastEvaluatedKey)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                  >
                    {isLoading ? 'Loading...' : 'Next Article'}
                  </Button>
                </CardFooter>
              </Card>
            </CSSTransition>
          )}
        </TransitionGroup>
      </div>
    </div>
  );
};

export default NewsApp;