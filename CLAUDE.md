# CLAUDE.md

Project instructions for Claude Code when working with this repository.

## Overview

Resolver is a consciousness mapping app based on the [Resolver pattern](https://www.isaacbowen.com/2025/06/04/resolver). Users model different "selves" (Work Me, Parent Me, etc.) with observations organized in a consciousness framework.

## Quick Start

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (port 5173)
npm test -- --run    # Run tests once
npm run build        # Build for production
```

## Architecture

**Stack:** React 19 + Vite + Tailwind CSS (CDN) + Lucide Icons

**Single Component:** Everything is in `/src/components/resolver.jsx` (1500+ lines)
- No external state management
- All state in React hooks
- LocalStorage for persistence
- Modal-based UI (no browser prompts)

**Data Model:**
- Max 3 selves per user
- Each self has: Known, Knowable A, Knowable B observations
- Authority can be external or self-directed
- All data stored locally in browser

**Features:**
- Interactive tutorial with examples
- Three themes (Light, Dark, High Contrast)
- Privacy-focused (no servers, no tracking)
- Full test coverage (42 tests)

## Key Files

- `src/components/resolver.jsx` - Main component
- `src/utils/validation.js` - Input validation/sanitization
- `README.md` - User documentation
- `CLAUDE.md` - This file