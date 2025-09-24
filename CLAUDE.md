# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Resolver is a personal consciousness mapping application that helps users model different aspects of their identity (selves). Each self has observations organized in a 2x2 consciousness framework (Known, Knowable A/B, Unknown) and an authority structure.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (port 5173)
npm run dev

# Build for production
npm run build

# Run tests
npm test                 # Run tests in watch mode
npm test -- --run       # Run tests once
npm run test:ui         # Run tests with UI
npm run test:coverage   # Run tests with coverage report
```

## Architecture

### Tech Stack
- **React 19** with function components and hooks
- **Vite** as build tool and dev server
- **Tailwind CSS** (loaded via CDN in index.html)
- **Lucide React** for icons

### File Structure
- `/src/main.jsx` - Application entry point
- `/src/app.jsx` - Root component wrapper
- `/src/components/resolver.jsx` - Main application component (single-file monolith containing all logic and UI)

### Key Concepts

**Self Model Structure:**
```javascript
{
  id: number,
  name: string,
  observations: {
    known: string[],
    knowable_1: string[],
    knowable_2: string[]
  },
  authority: {
    name: string,
    pointsToSelf: boolean
  }
}
```

**Application State (in resolver.jsx):**
- `user` - Current user name
- `selves` - Array of self models (max 3)
- `focusedSelf` - Currently selected self for detailed view
- `chatMessages` - Chat conversation history
- Component uses local React state management (no external state library)

**Views:**
- Board View - Overview grid of all selves
- Focus View - Detailed view of single self with observations
- Chat Interface - Placeholder for AI-assisted reflection (UI only)

## Important Implementation Details

- The entire application is contained in a single component file (`resolver.jsx`)
- Maximum of 3 self models supported by design
- Observations can be added/removed dynamically from each category
- Authority relationships can be self-directed or external
- Sample data initializes with "Work Me" and "Parent Me" examples
- Chat functionality shows UI but is not connected to any backend
- **Data persistence:** All state is auto-saved to localStorage
- **Input validation:** All user inputs are validated and sanitized (`src/utils/validation.js`)
- **Testing:** Uses Vitest with React Testing Library for component and unit tests