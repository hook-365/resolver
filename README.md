# 🧠 Resolver

> A tool for coming home to yourself so thoroughly that others can find you there too

[![React](https://img.shields.io/badge/React-19.1-61dafb?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff?logo=vite)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Tests-Vitest-6e9f18?logo=vitest)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 🌟 Overview

Resolver is a consciousness mapping application based on the [Resolver pattern](https://www.isaacbowen.com/2025/06/04/resolver) - a conceptual framework for processing awareness and self-transformation. It treats identity as a dynamic retrieval process rather than fixed storage, allowing continuous self-modification through reassigning the "pointers" between your experience of awareness, your sense of self, and the authorities that legitimize your experience.

The app helps you model different "selves" - the various roles and identities you embody in life (Work Me, Parent Me, Creative Me, etc.). Each self has its own observations organized in a consciousness framework that explores what you know, what you could know, and what remains unknown. The authority structure for each self determines whether it's self-directed or defers to external validation.

### ✨ Key Features

- **🎭 Multiple Self Models** - Create up to 3 distinct self representations
- **🗂️ Consciousness Framework** - Organize thoughts in Known/Knowable/Unknown categories
- **🔗 Authority Structures** - Define whether each self is self-directed or defers to external authority
- **💾 Persistent Storage** - All data auto-saves to browser localStorage
- **🔒 Input Validation** - Comprehensive validation and sanitization for all user inputs
- **📝 Markdown Notes** - Rich text notes with markdown formatting support
- **🎨 Visual Themes** - Light, dark, and colorblind-friendly themes
- **🔄 Custom Modals** - Intuitive input dialogs replace browser prompts
- **📱 Responsive Design** - Works seamlessly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/hook-365/resolver.git
cd resolver

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## 🎮 Usage

### Getting Started

1. **Begin Your Journey**
   - Choose "begin with demo" to explore with sample data
   - Choose "start empty" to create your own personalized experience

2. **Create Your Selves**
   - Click "Add New Self" to create a new identity model
   - Name it based on a role or aspect of your life
   - Define its authority structure (self-directed or external)

3. **Map Your Consciousness**
   - Click any self card to enter focus mode
   - Add observations to different categories:
     - **Known**: What this self clearly understands
     - **Knowable A & B**: Things this self could learn or realize
     - **Unknown**: Intentionally left empty (what we don't know we don't know)

4. **Manage & Reflect**
   - Edit names and authority structures anytime
   - Delete observations or entire selves when needed
   - Add markdown-formatted notes for deeper reflection
   - Switch between light, dark, and colorblind themes
   - Use "Start Fresh" to reset and begin anew

## 🧪 Testing

```bash
# Run tests in watch mode
npm test

# Run tests once
npm test -- --run

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## 🛠️ Tech Stack

- **[React 19](https://react.dev/)** - UI framework with hooks
- **[Vite](https://vitejs.dev/)** - Lightning-fast build tool
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling (CDN)
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[Vitest](https://vitest.dev/)** - Unit testing framework
- **[React Testing Library](https://testing-library.com/react)** - Component testing
- **localStorage API** - Browser-based data persistence
- **Custom Modal System** - Enhanced user input experience

## 📁 Project Structure

```
resolver/
├── src/
│   ├── components/
│   │   └── resolver.jsx      # Main application component
│   ├── utils/
│   │   ├── validation.js     # Input validation utilities
│   │   └── validation.test.js
│   ├── test/
│   │   └── setup.js          # Test configuration
│   ├── app.jsx               # App wrapper
│   └── main.jsx              # Entry point
├── public/
│   └── index.html
├── vitest.config.js          # Test configuration
├── vite.config.js            # Build configuration
└── package.json
```

## 🎯 Philosophy & Concept

> "This will probably feel like relief, followed by friction and frustration, followed by breakthrough and then relief again. This product is simple to use, but your experience may not be easy."

Resolver implements the [Resolver consciousness framework](https://www.isaacbowen.com/2025/06/04/resolver), which views consciousness as a hierarchical structure: **[ experience of awareness ] < [ self ] < [ authority ]**. The key insight is that the pointers between these layers are mutable - you can voluntarily transform your ego by reconfiguring how your selves relate to their authorities.

The framework operates through three interconnected functions:
- **Know**: Understanding your current state of awareness
- **Resolve**: Activating when your current self-understanding breaks down
- **Love**: Integrating new information and experiences

This approach enables "intersubjective compatibility" - legitimizing your own experience while maintaining compatibility with how others experience you. It's a tool for adaptive awareness and continuous growth through self-integration.

## 🚧 Roadmap

- [x] **Multiple Themes** - Dark mode and colorblind-friendly themes
- [x] **Markdown Notes** - Rich text notes with formatting
- [x] **Custom Input Modals** - Better UX than browser prompts

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and patterns
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 🐛 Known Issues

- Maximum of 3 self models is a design constraint
- Data is stored locally only (no cloud sync)
- Theme preference persists but requires page refresh in some cases

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Based on the [Resolver pattern](https://www.isaacbowen.com/2025/06/04/resolver) by Isaac Bowen
- Inspired by consciousness mapping and identity frameworks
- Built with love for self-reflection and personal growth
- Special thanks to all contributors and early testers

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/hook-365/resolver/issues)
- **Discussions**: [GitHub Discussions](https://github.com/hook-365/resolver/discussions)

---

<div align="center">
  Made with ❤️ for self-discovery
  <br>
  <a href="https://github.com/hook-365/resolver">View on GitHub</a>
</div>