## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env` and set your keys:
   - `VITE_TMDB_API_KEY=your_tmdb_api_key_here` (recommended - default)
3. Run the app:
   `npm run dev`

## API Providers

This app supports multiple movie and TV show data providers. You can switch between them in Settings > Data Sources:

### The Movie Database (TMDb) - Default
- **API Key**: Required (`VITE_TMDB_API_KEY`)
- **Features**: Movies, TV shows, trailers, rich metadata
- **Get Key**: [themoviedb.org](https://www.themoviedb.org/settings/api)

## Features

- 🎬 Browse movies and TV shows
- 🔍 Search functionality
- ❤️ Favorites management
- 🎞️ Trailer playback
- 📱 Responsive design
- ⚙️ Multiple API provider support
