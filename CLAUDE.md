# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the `mak-lab` repository - a private experimental/learning repository for development projects.

## Projects

### Todo App (`todo/`)

A vanilla JavaScript todo application with CRUD operations, filtering, priority levels, and localStorage persistence.

#### Running the App

Simply open `todo/index.html` in a web browser. No build process or dependencies required.

#### Project Structure

- `todo/index.html` - Main HTML structure with input form, filter buttons, and todo list
- `todo/styles.css` - Modern, gradient-based UI with priority color coding
- `todo/app.js` - TodoApp class managing state, localStorage, and DOM manipulation
- `todo/README.md` - Project documentation

### Architecture

**Class-based Design**: The app uses a single `TodoApp` class that encapsulates all functionality.

**Data Model**: Each todo object contains:
- `id`: Unique timestamp-based identifier
- `text`: Task description
- `completed`: Boolean status
- `priority`: 'high' | 'medium' | 'low'
- `createdAt`: ISO timestamp

**State Management**:
- Todos stored in class instance (`this.todos`)
- Automatically persisted to localStorage on every change
- Current filter state (`all`, `active`, `completed`) tracked separately

**Rendering**: Full re-render approach - entire todo list is rebuilt from state on each change. Event listeners are re-attached after each render.

### Todo App - Next.js (`todo-next/`)

A modern todo application built with Next.js 16, TypeScript, and Tailwind CSS using the App Router.

#### Running the App

```bash
cd todo-next
npm run dev
```

Then open http://localhost:3000

#### Build for Production

```bash
npm run build
npm start
```

#### Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - State management with useState/useEffect

#### Project Structure

- `app/page.tsx` - Main todo application component (Client Component)
- `app/layout.tsx` - Root layout with metadata and fonts
- `app/globals.css` - Global styles and Tailwind directives

#### Architecture

**Client-Side Rendering**: Uses `'use client'` directive for interactive features.

**Data Model**: Same as vanilla version - TypeScript interfaces ensure type safety:
```typescript
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}
```

**State Management**:
- React useState for todo list, input, filter, and priority
- useEffect for localStorage sync (with hydration mismatch prevention)
- Separate localStorage key (`todos-next`) to avoid conflicts with vanilla version

**Styling**: Tailwind CSS with:
- Gradient background (purple theme)
- Priority-based color coding (red/orange/green)
- Responsive design
- Smooth transitions and hover effects
