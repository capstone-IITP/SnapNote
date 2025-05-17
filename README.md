# Sticky Notes App

A simple, interactive sticky notes application built with React and TypeScript where users can create, edit, move, and delete digital sticky notes.

## Features

- Create new notes by clicking the "+" button or double-clicking anywhere on the background
- Edit notes by typing directly into them
- Move notes by dragging them around the screen
- Delete notes using the "×" button
- Notes automatically save to localStorage and persist between sessions
- Each note gets a random pastel color
- Notes stack properly with the most recently interacted note appearing on top

## Technologies Used

- React
- TypeScript
- Styled Components
- Vite

## Getting Started

### Prerequisites

- Node.js (version 14.x or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/sticky-notes.git
   cd sticky-notes
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

- Click the "+" button in the bottom right corner to create a new note in the center of the screen
- Double-click anywhere on the background to create a note at that position
- Click and drag a note to move it
- Click on a note to bring it to the front
- Type in a note to edit its content
- Click the "×" button to delete a note

## Building for Production

```
npm run build
```

This will generate a production-ready build in the `dist` folder.

## License

MIT
