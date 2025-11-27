# Kanban Board - Project Management App

A beautiful, interactive kanban board application built with Next.js, React, Tailwind CSS, and @dnd-kit for drag-and-drop functionality.

## Features

- **Drag and Drop**: Seamlessly drag cards between columns with smooth animations
- **Card Management**: Create, edit, and delete cards with titles, descriptions, priorities, and tags
- **Column Management**: Create new columns and edit column titles
- **Local Storage**: All data is automatically saved to browser local storage
- **Demo Data**: Pre-populated demo cards to showcase the app's features
- **Responsive Design**: Works beautifully on mobile, tablet, and desktop
- **Beautiful UI**: Gradient background, smooth animations, and polished interactions

## Getting Started

### 1. Install Dependencies

```bash
cd /Users/Work/kanban-app
npm install
```

### 2. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
npm start
```

## How to Use

### Adding Cards
1. Click the "+ Add Card" button at the bottom of any column
2. Enter the card title
3. Click "Add" or press Enter to create the card

### Editing Cards
1. Click on any card to open the detail modal
2. Edit the title and description
3. Select a priority level (Low, Medium, High)
4. Click "Save Changes"

### Dragging Cards
1. Click and drag any card to reorder within a column
2. Drag cards between columns to move them
3. Release to drop the card in its new position

### Managing Columns
1. Click on a column title to edit its name
2. Click the "+ Add Column" button to create a new column
3. Cards in a column can be deleted via the card modal

### Demo Data
- The app comes pre-populated with demo cards marked as "Demo"
- Click the "Clear Demo Data" button to remove all demo cards
- Demo cards can also be deleted individually

## Project Structure

```
kanban-app/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main page with board logic
│   └── globals.css        # Global styles and animations
├── components/
│   ├── board/             # Board components
│   │   ├── Column.tsx     # Column component
│   │   └── Card.tsx       # Card component
│   ├── modals/            # Modal components
│   │   └── CardDetailModal.tsx
│   └── ui/                # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Textarea.tsx
├── lib/
│   ├── types.ts           # TypeScript interfaces
│   ├── constants.ts       # Default data and constants
│   └── storage.ts         # localStorage utilities
├── hooks/
│   ├── useKanbanBoard.ts  # State management hook
│   └── useLocalStorage.ts # localStorage hook
├── context/
│   └── KanbanContext.tsx  # React Context provider
└── package.json           # Dependencies
```

## Technologies Used

- **Next.js 15**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS 3**: Styling and animations
- **@dnd-kit**: Drag and drop functionality
- **UUID**: Unique ID generation

## Features Showcase

### Beautiful Design
- Gradient animated background
- Clean white cards on semi-transparent backgrounds
- Smooth hover effects and transitions
- Responsive layout that works on all devices

### Smooth Interactions
- Drag and drop with visual feedback
- Smooth card animations
- Modal dialogs with backdrop blur
- Keyboard shortcuts (ESC to close modals)

### Data Persistence
- Automatic localStorage save
- Data persists across browser sessions
- Debounced saves for better performance

### Card Properties
- Title (required)
- Description (optional, multi-line)
- Priority level (Low, Medium, High)
- Tags/Labels
- Auto timestamps (created, updated)
- Demo flag for distinguishing demo cards

## Customization

### Changing Colors
Edit `tailwind.config.ts` to change the gradient colors in the animation keyframes, or modify `app/globals.css` to change the gradient definition.

### Adding New Card Properties
1. Update the `Card` interface in `lib/types.ts`
2. Add form fields in `components/modals/CardDetailModal.tsx`
3. Update the `useKanbanBoard` hook to handle the new property

### Changing Animation Duration
Edit the gradient animation duration in `app/globals.css` (currently 15s) or update animation values in `tailwind.config.ts`.

## Performance

- Uses React Context for efficient state management
- Debounced localStorage saves (300ms)
- Memoized components to prevent unnecessary re-renders
- Optimized @dnd-kit integration for smooth dragging

## Future Enhancements

- User authentication
- Multi-board support
- Collaborative editing
- Advanced filtering and search
- Card due dates and reminders
- Assignees and comments
- Dark mode
- Keyboard shortcuts

## License

MIT
