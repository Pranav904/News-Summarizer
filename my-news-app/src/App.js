import React, { useState, useEffect } from 'react';
import ArticleCard from './components/ArticleCard';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/articles');
      const data = await response.json();
      setArticles(data.articles);
      setLoading(false);
    } catch (error) {
      setError('Error loading articles');
      setLoading(false);
    }
  };

  const handleNextArticle = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
  };

  return (
    <div className="container">
      <div className="left-section">
        <h1>Static Section</h1>
        <p>This section is static and remains unchanged.</p>
      </div>

      <div className="right-section">
        {loading && (
          <div className="article-placeholder">
            <div className="placeholder shimmer"></div>
            <div className="placeholder shimmer"></div>
            <div className="placeholder shimmer"></div>
          </div>
        )}
        
        {!loading && !error && articles.length > 0 && (
          <ArticleCard article={articles[currentIndex]} />
        )}
        
        {!loading && articles.length > 1 && (
          <button className="next-button" onClick={handleNextArticle}>
            Next Article
          </button>
        )}

        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}

export default App;