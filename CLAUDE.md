# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the `mak-lab` repository - a private experimental/learning repository for development projects.

## Current Project: Todo App

A vanilla JavaScript todo application with CRUD operations, filtering, priority levels, and localStorage persistence.

### Running the App

Simply open `index.html` in a web browser. No build process or dependencies required.

### Project Structure

- `index.html` - Main HTML structure with input form, filter buttons, and todo list
- `styles.css` - Modern, gradient-based UI with priority color coding
- `app.js` - TodoApp class managing state, localStorage, and DOM manipulation

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
