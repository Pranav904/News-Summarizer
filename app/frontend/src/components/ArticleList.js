import React, { useState, useEffect } from "react";
import ArticleCard from "./ArticleCard";
import LoadingPlaceholder from "./LoadingPlaceholder";
import { fetchArticles } from "../services/articleService";
// import "./ArticleList.css";

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const data = await fetchArticles();
      setArticles(data.articles);
      setLoading(false);
    } catch (error) {
      setError("Error loading articles");
      setLoading(false);
    }
  };

  const handleNextArticle = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
  };

  if (loading) {
    return <LoadingPlaceholder />;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="article-section">
      {articles.length > 0 && <ArticleCard article={articles[currentIndex]} />}
      {articles.length > 1 && (
        <button className="next-button" onClick={handleNextArticle}>
          Next Article
        </button>
      )}
    </div>
  );
};

export default ArticleList;