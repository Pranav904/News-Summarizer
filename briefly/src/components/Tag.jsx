import React from "react";

function Tag({ tag }) {
  return (
    <span
      className="px-2 py-1 mr-2 mb-1 inline-block text-xs rounded 
                bg-black text-white dark:bg-white dark:text-black"
    >
      {tag}
    </span>
  );
}

export default Tag;
