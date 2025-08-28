# 📺 Media Tracker

A comprehensive media tracking application built with Next.js, React, and Prisma. Track your movies, TV shows, books, games, and more with collections, watchlists, favorites, and detailed reviews.

![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.15.0-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791)

## ✨ Features

### 🎬 Media Management

- **Add Media Items**: Track movies, TV shows, books, games, podcasts, and more
- **Rich Details**: Title, description, genre, tags, release date, and custom fields
- **Status Tracking**: Not Started, In Progress, Completed, Dropped, On Hold
- **Media Types**: Support for 6+ different media types with type-specific fields

### 📚 Organization

- **Collections**: Create custom collections to organize your media
- **Watchlist**: Bookmark items to watch/read later with priority levels
- **Favorites**: Heart your favorite media items
- **Smart Search**: Find media by title, genre, tags, or description

### 📊 Reviews & Ratings

- **Detailed Reviews**: Add comprehensive reviews with ratings (1-10)
- **Progress Tracking**: Track your progress through books, TV series, etc.
- **Personal Notes**: Add private notes and thoughts

### 📈 Analytics

- **Statistics Dashboard**: View your media consumption patterns
- **Progress Insights**: Track completion rates and time spent
- **Collection Analytics**: See your largest collections and favorites

### 🎨 User Experience

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Professional UI**: Custom components with smooth animations
- **Dark/Light Theme**: Beautiful interface that adapts to your preference
- **Fast Search**: Real-time search with debouncing for optimal performance

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/rahatmoktadir03/media-tracker.git
   cd media-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/media_tracker"
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev

   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

### Frontend

- **Next.js 15.5.2** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Custom Components** - Reusable UI components

### Backend

- **Next.js API Routes** - Server-side API endpoints
- **Prisma ORM** - Type-safe database toolkit
- **PostgreSQL** - Relational database

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Turbopack** - Fast bundler for development

## 📁 Project Structure

```
media-tracker/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── media/               # Media CRUD operations
│   │   ├── collections/         # Collections management
│   │   ├── watchlist/           # Watchlist operations
│   │   ├── favorites/           # Favorites management
│   │   └── search/              # Search functionality
│   ├── collections/             # Collections pages
│   ├── watchlist/               # Watchlist page
│   ├── favorites/               # Favorites page
│   ├── media/[id]/              # Individual media pages
│   └── add-media/               # Add new media form
├── components/                   # Reusable components
│   ├── ui/                      # Base UI components
│   └── media/                   # Media-specific components
├── lib/                         # Utilities and configurations
│   ├── hooks/                   # Custom React hooks
│   ├── utils/                   # Helper functions
│   └── prisma.ts               # Database client
├── prisma/                      # Database schema and migrations
├── types/                       # TypeScript type definitions
└── public/                      # Static assets
```

## 🗄️ Database Schema

The application uses a PostgreSQL database with the following main entities:

- **MediaItem** - Core media information
- **Review** - User reviews and ratings
- **Collection** - Custom media collections
- **CollectionItem** - Media items in collections
- **WatchlistItem** - Items to watch later
- **Favorite** - Favorited media items
- **Tag** - Media tags and categories

## 🎯 API Endpoints

### Media Management

- `GET /api/media` - Get all media items
- `POST /api/media` - Create new media item
- `GET /api/media/[id]` - Get specific media item
- `PUT /api/media/[id]` - Update media item
- `DELETE /api/media/[id]` - Delete media item

### Collections

- `GET /api/collections` - Get all collections
- `POST /api/collections` - Create new collection
- `GET /api/collections/[id]` - Get specific collection
- `PUT /api/collections/[id]` - Update collection
- `DELETE /api/collections/[id]` - Delete collection

### Watchlist & Favorites

- `GET/POST/DELETE /api/watchlist` - Manage watchlist
- `GET/POST/DELETE /api/favorites` - Manage favorites

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npx prisma studio    # Open Prisma Studio
npx prisma migrate   # Run database migrations
npx prisma generate  # Generate Prisma client

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

### Adding New Features

1. **Database Changes**: Update `prisma/schema.prisma` and run migrations
2. **API Routes**: Add new endpoints in `app/api/`
3. **Components**: Create reusable components in `components/`
4. **Pages**: Add new pages in the `app/` directory
5. **Types**: Update TypeScript types in `types/`

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on every push

### Other Platforms

- **Railway**: Easy PostgreSQL + app deployment
- **Render**: Free tier with PostgreSQL
- **Heroku**: Classic platform with add-ons

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database powered by [Prisma](https://prisma.io/)
- UI styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from various emoji sets

## 📞 Support

If you have any questions or run into issues, please:

1. Check the [Issues](https://github.com/rahatmoktadir03/media-tracker/issues) page
2. Create a new issue if needed
3. Contact the maintainer

---

**Happy tracking!** 🎉
