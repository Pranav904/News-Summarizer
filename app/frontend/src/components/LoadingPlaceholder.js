import React from "react";
import "./LoadingPlaceholder.css";

const LoadingPlaceholder = () => {
  return (
    <div class="card">
      <div class="card-image">
        <div class="load-wraper">
          <div class="activity"></div>
        </div>
      </div>
      <div class="card-content">
        <div class="card-text">
          <div class="load-wraper">
            <div class="activity"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPlaceholder;
