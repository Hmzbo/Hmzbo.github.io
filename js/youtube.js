document.addEventListener("DOMContentLoaded", () => {
      const channelId = "UCm5gNeYzMB8_ugMl256x4AQ";
      
      const postsContainer = document.getElementById("youtube-videos-container");
      const loadingMessage = postsContainer.querySelector(".loading-message");
      const rssToJsonApi = `https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
      const maxVideos = 3; // Number of videos to display

      fetch(rssToJsonApi)
        .then(response => response.json())
        .then(data => {
          if (data.status === 'ok') {
            loadingMessage.remove();
            const videos = data.items;

            videos.slice(0, maxVideos).forEach(video => {
              const card = document.createElement("div");
              card.className = "video-card";
              card.innerHTML = `
                <a href="${video.link}" target="_blank" rel="noopener noreferrer">
                  <div class="video-thumbnail">
                    <img src="${video.thumbnail}" alt="Thumbnail for ${video.title}" loading="lazy">
                  </div>
                  <div class="video-content">
                    <h3>${video.title}</h3>
                  </div>
                </a>
              `;
              postsContainer.appendChild(card);
            });
          } else {
            loadingMessage.textContent = "Failed to load videos.";
            console.error("RSS to JSON API Error:", data.message);
          }
        })
        .catch(error => {
          loadingMessage.textContent = "Failed to load videos due to a network error.";
          console.error("Network Error:", error);
        });
    });
