"use client";

import { useState, useEffect } from "react";

const predefinedTags = [
  "World News", "Politics", "Economy", "Business", "Technology", 
  "Health", "Environment", "Science", "Education", "Sports",
  "Entertainment", "Culture", "Lifestyle", "Travel", "Crime", 
  "Opinion", "Social Issues", "Innovation", "Human Rights", "Weather"
];

const PreferencesComponent = ({ user }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserPreferences();
    }
  }, [user]);

  const fetchUserPreferences = async () => {
    try {
      const response = await fetch('/api/preferences');
      const data = await response.json();
      
      if (data?.preferences?.length > 0) {
        setSelectedTags(data.preferences);
        setShowPrompt(false);
      } else {
        setShowPrompt(true);
        setIsEditing(true);
      }
    } catch (err) {
      setError("Failed to load preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleTagClick = (tag) => {
    if (!isEditing) return;
    
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: selectedTags }),
      });
      setIsEditing(false);
      setShowPrompt(false);
    } catch (err) {
      setError("Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-4 rounded border">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-lg shadow">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          {showPrompt ? "Select Your Preferred Tags" : "Your Tag Preferences"}
        </h2>
        {!showPrompt && !isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="btn-secondary"
          >
            Edit Preferences
          </button>
        )}
      </div>

      {showPrompt && (
        <div className="mb-4 p-4 rounded border">
          Please select your preferred tags to personalize your experience
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {predefinedTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            disabled={!isEditing}
            className={`
              px-4 py-2 rounded transition
              ${isEditing ? 'cursor-pointer' : 'cursor-default'}
              ${selectedTags.includes(tag) ? 'btn-primary' : 'btn-secondary'}
            `}
          >
            {tag}
          </button>
        ))}
      </div>

      {isEditing && (
        <div className="flex justify-end gap-2">
          {!showPrompt && (
            <button
              onClick={() => {
                setIsEditing(false);
                fetchUserPreferences();
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={selectedTags.length === 0}
            className={`btn-primary ${selectedTags.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Save Preferences
          </button>
        </div>
      )}
    </div>
  );
};

export default PreferencesComponent;