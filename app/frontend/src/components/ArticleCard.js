import React from 'react';
import './ArticleCard.css';
import Tag from './Tag'; // Import the Tag component

function ArticleCard({ article }) {
  const { title, summary, imageUrl, author, publishDate, url, tags } = article;

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <div className="article-card fade-in">
      <h2>{title}</h2>
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="article-image" />
      ) : (
        <div className="image-placeholder">No Image Available</div>
      )}
      {/* Render tags below the image */}
      <div className="tags-container">
        {tags && tags.map((tag, index) => <Tag key={index} tag={tag} />)}
      </div>
      <p>{summary}</p>
      <div className="article-meta">
        {author && <span>Author: {author}</span>}
        <span>Published: {formatDate(publishDate)}</span>
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer">
        Read Full Article
      </a>
    </div>
  );
}

export default ArticleCard;