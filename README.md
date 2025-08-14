# Resolver

A personal consciousness mapping application for understanding and managing multiple aspects of your identity.

## Overview

Resolver helps you model different "selves" - the various roles and identities you embody in life (Work Me, Parent Me, Creative Me, etc.). Each self has its own observations organized in a 2x2 consciousness framework:

- **Known**: What this self clearly understands
- **Knowable A & B**: Things this self could learn or realize
- **Unknown**: Intentionally left empty (what we don't know we don't know)

Each self also has an **authority structure** - either self-directed or deferring to external authority (manager, values, society, etc.).

## Features

### Self Management
- ✅ Create new selves with custom names and authority structures
- ✅ Edit self names and authority relationships
- ✅ Delete selves (with confirmation)
- ✅ Support for up to 3 self models

### Consciousness Framework
- ✅ 2x2 observation grid for each self
- ✅ Add/remove observations in each category
- ✅ Visual organization of thoughts and insights

### Views
- **Board View**: Overview of all your selves
- **Focus View**: Deep dive into a single self
- **Chat Integration**: Framework for AI-assisted reflection (UI ready)

## Getting Started

### Prerequisites
- Node.js (version 16+)
- npm

### Installation

1. Clone the repository
```bash
git clone [your-repo-url]
cd resolver
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Building for Production
```bash
npm run build
```

## Technology Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling (via CDN)
- **Lucide React** - Icons

## Usage

1. **Start**: Click "begin" to initialize with sample data
2. **Create**: Use the "Add New Self" card to create new self models
3. **Explore**: Click any self card to focus and add observations
4. **Edit**: Use edit icons to modify names and authority structures
5. **Organize**: Add thoughts to Known/Knowable categories

## Philosophy

> "This will probably feel like relief, followed by friction and frustration, followed by breakthrough and then relief again. This product is simple to use, but your experience may not be easy."

Resolver is designed for introspection and self-understanding. It provides structure for examining the different aspects of your identity and their relationships.

## Contributing

This is a personal project, but feedback and suggestions are welcome through issues.

## License

ISC