let toastTimeout;
const favoritesStorageKey = "mg_favorites";
let favorites = loadFavorites();
let favoritesOnly = false;
let searchQuery = "";

function loadFavorites() {
  try {
    const storedFavorites = JSON.parse(window.localStorage.getItem(favoritesStorageKey) || "[]");
    return new Set(Array.isArray(storedFavorites) ? storedFavorites : []);
  } catch {
    return new Set();
  }
}

function saveFavorites() {
  try {
    window.localStorage.setItem(favoritesStorageKey, JSON.stringify([...favorites]));
  } catch {
    showToast("Favorites could not be saved in this browser.");
  }
}

function updateFavoriteCount() {
  document.querySelectorAll(".favorites-count").forEach((count) => {
    count.textContent = favorites.size;
  });
}

function filterGallery() {
  document.querySelectorAll("#gallery section").forEach((section) => {
    const cards = [...section.querySelectorAll(".gallery-card")];
    cards.forEach((card) => {
      const matchesSearch = card.dataset.title.includes(searchQuery);
      const matchesFavorites = !favoritesOnly || favorites.has(card.dataset.img);
      card.hidden = !matchesSearch || !matchesFavorites;
    });
    section.hidden = cards.every((card) => card.hidden);
  });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 2000);
}

function renderGallery(rows) {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;
  const fragment = document.createDocumentFragment();

  rows.forEach((row) => {
    const section = document.createElement("section");
    section.className = row.className;

    row.items.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = `${item.type === "video" ? "BOX2" : "box"} gallery-card box${index + 1}`;
      card.dataset.img = item.src;
      card.dataset.title = (item.title || item.src.split("/").pop().replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ")).toLowerCase();

      if (item.type === "video") {
        const video = document.createElement("video");
        video.src = item.src;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        card.append(video);
        card.addEventListener("mouseenter", () => {
          video.play().catch(() => {});
        });
        card.addEventListener("mouseleave", () => {
          video.pause();
          video.currentTime = 0;
        });
      } else {
        card.style.backgroundImage = `linear-gradient(transparent 65%, rgba(0, 0, 0, 0.833)), url("${item.src}")`;
      }

      const text = document.createElement("div");
      text.className = "text";
      const favoriteButton = document.createElement("button");
      favoriteButton.type = "button";
      favoriteButton.className = "favorite-button";
      favoriteButton.setAttribute("aria-label", "Add to favorites");
      favoriteButton.setAttribute("aria-pressed", "false");
      favoriteButton.innerHTML = '<i class="fa-solid fa-heart" aria-hidden="true"></i>';
      const isFavorite = favorites.has(item.src);
      favoriteButton.classList.toggle("is-favorite", isFavorite);
      favoriteButton.setAttribute("aria-pressed", String(isFavorite));
      favoriteButton.setAttribute("aria-label", isFavorite ? "Remove from favorites" : "Add to favorites");
      favoriteButton.addEventListener("click", (event) => {
        event.stopPropagation();
        if (favorites.has(item.src)) favorites.delete(item.src);
        else favorites.add(item.src);
        saveFavorites();
        const selected = favorites.has(item.src);
        favoriteButton.classList.toggle("is-favorite", selected);
        favoriteButton.setAttribute("aria-pressed", String(selected));
        favoriteButton.setAttribute("aria-label", selected ? "Remove from favorites" : "Add to favorites");
        updateFavoriteCount();
        filterGallery();
      });
      card.append(favoriteButton);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "download-btn";
      const icon = document.createElement("i");
      icon.className = "fa-solid fa-download";
      icon.setAttribute("aria-hidden", "true");
      button.append(icon, document.createTextNode(" Download"));
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const link = document.createElement("a");
        link.href = item.src;
        link.download = item.src.split("/").pop();
        document.body.append(link);
        link.click();
        link.remove();
        showToast("Download started.✔️");
      });
      text.append(button);
      card.append(text);
      section.append(card);
    });

    fragment.append(section);
  });

  gallery.replaceChildren(fragment);
  gallery.querySelectorAll(".favorite-button").forEach((button) => {
    const card = button.closest(".gallery-card");
    const isFavorite = favorites.has(card.dataset.img);
    button.classList.toggle("is-favorite", isFavorite);
    button.setAttribute("aria-pressed", String(isFavorite));
    button.setAttribute("aria-label", isFavorite ? "Remove from favorites" : "Add to favorites");
  });
  filterGallery();
}

document.getElementById("gallery-search")?.addEventListener("input", (event) => {
  searchQuery = event.target.value.trim().toLowerCase();
  filterGallery();
});

document.querySelectorAll(".favorites-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    favoritesOnly = !favoritesOnly;
    button.classList.toggle("is-active", favoritesOnly);
    button.setAttribute("aria-pressed", String(favoritesOnly));
    filterGallery();
  });
});

window.addEventListener("storage", (event) => {
  if (event.key !== favoritesStorageKey) return;
  favorites = loadFavorites();
  updateFavoriteCount();
  document.querySelectorAll("#gallery .favorite-button").forEach((button) => {
    const isFavorite = favorites.has(button.closest(".gallery-card").dataset.img);
    button.classList.toggle("is-favorite", isFavorite);
    button.setAttribute("aria-pressed", String(isFavorite));
    button.setAttribute("aria-label", isFavorite ? "Remove from favorites" : "Add to favorites");
  });
  filterGallery();
});

if ("FontFace" in window) {
  const font = new FontFace("Lequire", 'url("assets/font/Lequire.otf")');
  font.load().then((loadedFont) => document.fonts.add(loadedFont)).catch(() => {});
}

const imageGalleries = {
  "game": [
    {
      "className": "main1",
      "items": [
        {
          "src": "assets/image/g-1.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/g-2.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/g-3.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/g-4.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/g-5.jpg",
          "type": "image"
        }
      ]
    },
    {
      "className": "main2",
      "items": [
        {
          "src": "assets/image/g2-1.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/g2-2.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/g2-3.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/g2-4.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/g2-5.jpg",
          "type": "image"
        }
      ]
    },
    {
      "className": "main3",
      "items": [
        {
          "src": "assets/image/g3-1.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/g3-2.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/g3-3.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/g3-4.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/g3-5.jpg",
          "type": "image"
        }
      ]
    },
    {
      "className": "main4",
      "items": [
        {
          "src": "assets/image/g4-1.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/g4-2.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/g4-3.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/g4-4.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/g4-5.jpg",
          "type": "image"
        }
      ]
    }
  ],
  "car": [
    {
      "className": "main1",
      "items": [
        {
          "src": "assets/image/Car/g-1.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/Car/g-2.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/Car/g-3.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/Car/g-4.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/Car/g-5.jpg",
          "type": "image"
        }
      ]
    },
    {
      "className": "main2",
      "items": [
        {
          "src": "assets/image/Car/g2-1.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/Car/g2-2.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/Car/g2-3.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/Car/g2-4.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/Car/g2-5.jpg",
          "type": "image"
        }
      ]
    },
    {
      "className": "main3",
      "items": [
        {
          "src": "assets/image/Car/g3-1.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/Car/g3-2.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/Car/g3-3.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/Car/g3-4.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/Car/g3-5.jpg",
          "type": "image"
        }
      ]
    },
    {
      "className": "main4",
      "items": [
        {
          "src": "assets/image/Car/g4-1.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/Car/g4-2.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/Car/g4-3.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/Car/g4-4.jpg",
          "type": "image"
        },
        {
          "src": "assets/image/Car/g4-5.jpg",
          "type": "image"
        }
      ]
    }
  ]
};

const gallery = document.getElementById("gallery");
if (gallery && imageGalleries[gallery.dataset.gallery]) {
  renderGallery(imageGalleries[gallery.dataset.gallery]);
}
updateFavoriteCount();
