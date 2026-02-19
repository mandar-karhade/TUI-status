# LinkedIn TUI Generator

A sleek, terminal-inspired project dashboard and status generator designed for LinkedIn updates. This tool allows developers to showcase their builds and progress in a clean terminal-style graphic.

![Terminal Preview](https://github.com/mandar-karhade/TUI-status/raw/main/preview.png)

## 🚀 Features

- **Hierarchical Project Model**: Organize your work by **Projects** (e.g., OnlyOffline, DroidForge) and nested **Products** (e.g., iOS App, Android App, CLI).
- **Elegant Icons**: A curated set of "Elegant" symbols to represent different tech stacks and project types.
- **Progress Visualization**: Real-time terminal-style progress bars with percentage indicators.
- **Toggleable Stats**: Granular control over displaying GitHub stars and commit counts per project.
- **Multiple Styles**: Choose between Full TUI, Compact, Double Border, or Minimal layouts.
- **Smart suggestions**: Automatically suggests icons based on your project name or philosophy.
- **Persistence & Portability**: 
  - Automatic session saving to localStorage.
  - Export/Import configurations as JSON files.
- **Aesthetic Simulation**: Built-in LinkedIn post preview with a dark mode aesthetic.

## 🛠️ Tech Stack

- **React**: Core framework for the editor and generator logic.
- **Vite**: Ultra-fast build tool and dev server.
- **ZSH/Terminal Aesthetic**: Custom CSS for that premium terminal feel.

## 🏃 Local Development

### Prerequisites
- Node.js (v18+)
- pnpm (recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mandar-karhade/TUI-status.git
   cd TUI-status
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser to `http://localhost:5173` (or the port shown in your terminal).

## 📄 License
MIT

---
*Built with ⚡ by [Mandar Karhade](https://github.com/mandar-karhade)*
