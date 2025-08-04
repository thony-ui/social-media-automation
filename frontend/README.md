# AutoContent Studio - Frontend

This is the Next.js frontend application for AutoContent Studio.

## Features

- 🎨 Modern UI with shadcn/ui components
- 🎯 Drag & Drop interface for post management
- 📱 Responsive design with Tailwind CSS
- 🔄 Real-time updates and interactions
- 🎭 Dark/Light mode support

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React DnD** - Drag and drop
- **Lucide React** - Icons

## Environment Variables

The frontend uses these environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
