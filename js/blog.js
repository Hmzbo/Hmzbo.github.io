document.addEventListener("DOMContentLoaded", () => {
  const mediumUsername = "hamzamlwh"; // <-- CHANGE TO YOUR MEDIUM USERNAME
  const postsContainer = document.getElementById("medium-posts-container");
  const loadingMessage = postsContainer.querySelector(".loading-message");
  const rssToJsonApi = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${mediumUsername}`;
  const maxPosts = 3; // Number of posts to display

  // Helper function to create a clean text snippet from HTML content
  const createSnippet = (html, maxLength) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const getThumbnail = (html) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      const firstImage = tempDiv.querySelector("img");
      return firstImage ? firstImage.src : "https://via.placeholder.com/300x150";
  }

  fetch(rssToJsonApi)
    .then(response => response.json())
    .then(data => {
      // Check if the API call was successful
      if (data.status === 'ok') {
        loadingMessage.remove(); // Remove the loading message
        const posts = data.items;

        posts.slice(0, maxPosts).forEach(post => {
          const snippet = createSnippet(post.description, 120);
          const thumbnail = getThumbnail(post.description);
          const postDate = new Date(post.pubDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          const card = document.createElement("div");
          card.className = "post-card";
          card.innerHTML = `
            <a href="${post.link}" target="_blank" rel="noopener noreferrer">
              <div class="post-thumbnail">
                <img src="${thumbnail}" alt="${post.title}" loading="lazy">
              </div>
              <div class="post-content">
                <h3>${post.title}</h3>
                <p>${snippet}</p>
                <div class="post-date">${postDate}</div>
              </div>
            </a>
          `;
          postsContainer.appendChild(card);
        });
      } else {
        // Handle API errors
        loadingMessage.textContent = "Failed to load posts. Please try again later.";
        console.error("RSS to JSON API Error:", data.message);
      }
    })
    .catch(error => {
      // Handle network errors
      loadingMessage.textContent = "Failed to load posts due to a network error.";
      console.error("Network Error:", error);
    });
});
