# Magic Gallery

## About

Magic Gallery is a static wallpaper gallery featuring game images, car photography, and live video wallpapers. It keeps the existing animated background, navigation, expanding cards, loading screen, footer, and download notifications.

## Features

- Game and car galleries with 20 images each.
- Live wallpaper gallery with 30 video cards and hover previews.
- Data-driven cards and download buttons created with JavaScript.
- Shared rendering and download behavior across all three pages.
- Local image, video, and font assets.

## Tech Stack

- HTML5, CSS3, and vanilla JavaScript.
- Local JPEG images, MP4 videos, and an OpenType font.
- Existing external Google Fonts, Font Awesome, and typing-banner services.
- Bootstrap on the game page.

## Getting Started

1. Download or copy the complete project, retaining its directory structure.
2. Open `index.html` in a modern browser, or serve the project root with a local static web server.
3. Use the navigation to visit `index2.html` (live wallpapers) and `index-car.html` (cars).
4. Hover over a card to reveal its download button. Live videos preview on hover.

No build step or package installation is required. Internet access is needed for the existing external fonts, icons, banner, and Bootstrap resources. Download buttons request a browser download; completion depends on browser settings.

Gallery data and shared rendering live in `Js/script.js`; live wallpaper data lives in `Js/script2.js`. Keep asset paths aligned with files in `assets/`. Placeholder navigation and social links remain unchanged.
