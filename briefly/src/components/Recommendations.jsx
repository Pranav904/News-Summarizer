import { useEffect, useState } from "react";

function Recommendations() {
  const [articles, setArticles] = useState([]);
  const [lastKey, setLastKey] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchArticles = async (key) => {
    setLoading(true);
    const res = await fetch(
      `/api/recommendation?lastKey=${key ? JSON.stringify(key) : ""}`
    );
    const data = await res.json();

    setArticles((prevArticles) => [...prevArticles, ...data.articles]);
    setLastKey(data.lastKey);
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Load more on div scroll
  const handleScroll = (e) => {
    const div = e.target;
    if (
      div.scrollTop + div.clientHeight >= div.scrollHeight - 50 &&
      !loading &&
      lastKey
    ) {
      fetchArticles(lastKey);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Recommended Articles</h2>
      <div
        className="scrollable-div overflow-y-auto"
        style={{ height: "70vh" }}
        onScroll={handleScroll}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.length > 0 ? (
            articles.map((article) => (
              <div
                key={article.article_id}
                className="card p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 dark:text-gray-200"
              >
                <h3 className="text-xl font-semibold dark:text-gray-100">
                  {article.title}
                </h3>
                <p className="text-gray-700 mt-2 dark:text-gray-300">
                  {article.content.substring(0, 100)}...
                </p>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Tags: {article.tags.join(", ")}
                  </p>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Published: {article.published_date}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No recommendations available</p>
          )}
        </div>
        {loading && <p>Loading more articles...</p>}
      </div>
    </div>
  );
}

export default Recommendations;
