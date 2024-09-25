export const fetchArticles = async () => {
    const response = await fetch("http://localhost:3000/api/articles");
    if (!response.ok) {
      throw new Error("Failed to fetch articles");
    }
    return await response.json();
  };  