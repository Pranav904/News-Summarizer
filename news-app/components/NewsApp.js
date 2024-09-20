import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTransition, animated, useSpringRef } from '@react-spring/web';
import styles from '../styles/NewsApp.module.css';

export async function getServerSideProps() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`);
  const data = await res.json();
  return { props: { initialArticles: data.articles, initialLastEvaluatedKey: data.lastEvaluatedKey } };
}

const NewsApp = ({ initialArticles, initialLastEvaluatedKey }) => {
  const [articlesData, setArticlesData] = useState({
    articles: initialArticles,
    lastEvaluatedKey: initialLastEvaluatedKey,
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

  const handleNextArticle = () => {
    if (currentIndex === articlesData.articles.length - 2 && articlesData.lastEvaluatedKey) {
      fetchArticles();
    }
    setCurrentIndex(prevIndex => (prevIndex + 1) % articlesData.articles.length);
  };

  const transRef = useSpringRef();
  const transitions = useTransition(currentIndex, {
    ref: transRef,
    keys: null,
    from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
  });

  useEffect(() => {
    transRef.start();
  }, [currentIndex]);

  return (
    <div className={styles.newsContainer}>
      <div className={styles.leftPanel}>
        <h1 className={styles.newsTitle}>NEWS Summarizer</h1>
      </div>
      <div className={styles.rightPanel}>
        {error && <p className="text-red-500">{error}</p>}
        {articlesData.articles.length > 0 && (
          <div className={styles.cardContainer} onClick={handleNextArticle}>
            {transitions((style, i) => {
              const currentArticle = articlesData.articles[i];
              return (
                <animated.div style={style} className={styles.animatedCard}>
                  <Card className={styles.card}>
                    <CardContent className={styles.cardContent}>
                      <h2 className={styles.articleTitle}>{currentArticle.title}</h2>
                      <p className={styles.articleMeta}>
                        By {currentArticle.author ? currentArticle.author : "Unknown"} | Published on {new Date(currentArticle.publishDate).toLocaleDateString()}
                      </p>
                      <div className={styles.imageContainer}>
                        {currentArticle.imageUrl && (
                          <img src={currentArticle.imageUrl} alt={currentArticle.title} className={styles.articleImage} />
                        )}
                      </div>
                      <p className={styles.articleSummary}>{currentArticle.summary}</p>
                    </CardContent>
                  </Card>
                </animated.div>
              );
            })}
          </div>
        )}
        <div className={styles.buttonContainer}>
          <Button 
            onClick={handleNextArticle} 
            disabled={isLoading || (currentIndex === articlesData.articles.length - 1 && !articlesData.lastEvaluatedKey)}
            className={styles.button}
          >
            Next Article
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewsApp;