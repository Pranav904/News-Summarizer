import { useState, useEffect } from "react";
import { fetchArticles } from "../services/articleService";

export const useArticles = () => {
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

  const nextArticle = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
  };

  return {
    articles,
    currentIndex,
    nextArticle,
    loading,
    error,
  };
};