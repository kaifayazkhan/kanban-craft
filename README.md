# Kanban Craft - A Task Management App

Kanban Craft is a simple task management application that helps users organize and manage their tasks using a drag-and-drop Kanban board.

## Features

- **Drag and Drop**: Move cards between lists and reorder both lists and cards within the board.
- **Task Management**: Add, edit, or delete tasks within each list.
- **Rich Text Editor**: Enter `/` to select and apply various formats such as headings, subheadings, to-dos, and more for detailed task descriptions.
- **Responsive UI**: Fully responsive and optimized for various screen sizes.
- **Persistent Data Storage**: Tasks are saved to localStorage for persistence across sessions.

## Tech Stack

- **Frontend**: Next.js
- **State Management**: Zustand
- **Drag and Drop**: `@hello-pangea/dnd`
- **Text Editor**: `novel`
- **Styling**: TailwindCSS
- **UI Library**: shadcn/ui

## Running the Project

To run the project locally, follow the steps below:

1. Clone the repository:

   ```bash
   git clone https://github.com/kaifayazkhan/kanban-craft
   ```

2. Run `npm install` or `pnpm install` in the project directory to install the required dependencies.
3. Run `npm run start` or `pnpm start` to get the project started.
4. Open your browser and visit http://localhost:3000 to see the app in action.

## Future Enhancements

- **User Authentication**: Secure login for users to track their tasks and preferences.
- **Backend Integration**: Transition to using a backend for data persistence.
- **Advanced Task Filters**: Search and filter tasks based on due dates, priority, etc.
- **Push Notifications**: Notify users of task changes or deadlines.
- **Multiple Workspaces**: Allow users to create and manage multiple workspaces.
