
# SEO Tag Analyzer

A modern web application that provides comprehensive analysis of website SEO tags with visual insights and actionable recommendations.

## Features

- **Real-time SEO Analysis**: Analyze any website's meta tags, Open Graph, and Twitter Card implementations
- **Visual Insights**: See how your website appears in search results and social media previews
- **Actionable Recommendations**: Get specific tips to improve your site's search engine visibility
- **Comprehensive Reports**: Detailed analysis of critical SEO elements including:
  - Title and meta description
  - Open Graph tags
  - Twitter Card implementation
  - Robots meta tags
  - Language and charset declarations

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express
- **Database**: NeonDB (PostgreSQL)
- **Build Tools**: Vite, ESBuild
- **Type Safety**: Zod, TypeScript

## Getting Started

1. Clone this repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/          # Frontend React application
├── server/          # Express backend server
├── shared/          # Shared types and schemas
└── public/          # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type check with TypeScript
- `npm run db:push` - Update database schema

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
