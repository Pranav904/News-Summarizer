import React, { useState, useEffect } from "react";
import ArticleCard from "./ArticleCard";
import LoadingPlaceholder from "./LoadingPlaceholder";
import { fetchArticles } from "../services/articleService";
import NextArticleButton from "./NextArticleButton";
import SignOutButton from "./SignOutButton";
import "./ArticleList.css";

const ArticleList = ({ onSignOut , user}) => {
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

  if (loading || !user) {
    return <LoadingPlaceholder />;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="article-section">
      {articles.length > 0 && <ArticleCard article={articles[currentIndex]} />}
      <div>
        {articles.length > 1 && (
          <NextArticleButton onNext={handleNextArticle} />
        )}
        <SignOutButton onSignOut={onSignOut} />
      </div>
    </div>
  );
};

export default ArticleList;
