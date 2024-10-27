import { useEffect, useState } from "react";
import { IconCaretUpFilled, IconCaretDownFilled } from "@tabler/icons-react";
import Tag from "./Tag"; // Import the Tag component

function Recommendations() {
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastKey, setLastKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nextImageLoading, setNextImageLoading] = useState(false);

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

  const nextArticle = () => {
    if (currentIndex < articles.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else if (lastKey && !loading) {
      fetchArticles(lastKey);
    }
  };

  const previousArticle = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const currentArticle = articles[currentIndex];

  // Preload next article's image
  useEffect(() => {
    const nextIndex = currentIndex + 1;
    if (articles[nextIndex] && articles[nextIndex].image_url) {
      const img = new Image();
      img.src = articles[nextIndex].image_url;
      img.onload = () => setNextImageLoading(false);
      setNextImageLoading(true);
    }
  }, [currentIndex, articles]);

  return (
    <div className="h-full container mx-auto p-6 flex flex-row items-center">
      {loading && articles.length === 0 ? (
        <p>Loading...</p>
      ) : currentArticle ? (
        <div className="flex items-center p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg ">
          <img
            src={currentArticle.image_url}
            alt={currentArticle.title}
            className="max-w-80 max-h-80 object-fill rounded-lg mr-8"
          />
          <div className="flex-1">
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-6 font-semibold dark:text-gray-100">
              {currentArticle.title}
            </h2>
            <div className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Author: {currentArticle.author}
            </div>
            <div className="tags-container flex flex-wrap mt-2">
              {currentArticle.tags &&
                currentArticle.tags.map((tag, index) => (
                  <Tag key={index} tag={tag} />
                ))}
            </div>

            <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 mt-2">
              {currentArticle.content}
            </p>
            <div className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Published: {currentArticle.published_date}
            </div>
            
          </div>
        </div>
      ) : (
        <p>No more articles available.</p>
      )}

      <div className="flex flex-col ml-4">
        <button
          onClick={previousArticle}
          disabled={currentIndex === 0}
          className="mb-2 px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-full disabled:opacity-50"
        >
          <IconCaretUpFilled />
        </button>
        <button
          onClick={nextArticle}
          disabled={loading && currentIndex === articles.length - 1}
          className="mt-2 px-4 py-2 bg-blue-500 dark:bg-blue-700 rounded-full disabled:opacity-50"
        >
          <IconCaretDownFilled />
        </button>
      </div>

      {loading && <p className="mt-4">Loading more articles...</p>}
      {nextImageLoading && <p className="mt-4">Loading next image...</p>}
    </div>
  );
}

export default Recommendations;
