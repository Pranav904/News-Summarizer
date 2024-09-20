import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion

const articleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function ArticleList({ articles, onLoadMore }) {
  return (
    <motion.div layout className="article-list">
      <AnimatePresence> 
        {articles.map((article, index) => (
          <motion.div
            key={index}
            className="article-card"
            variants={articleVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.5 }}
          >
            <h3>{article.title}</h3>
            <p>{article.summary}</p>
            <button onClick={() => console.log('Next Article')}>
              Next Article &rarr;
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
      {onLoadMore && (
        <button onClick={onLoadMore}>Load More</button>
      )}
    </motion.div>
  );
}

export default ArticleList;