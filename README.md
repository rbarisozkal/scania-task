# Message Tree Regeneration Application

## Overview

This application allows you to regenerate and display messages in a tree structure. Each message can have replies, forming a hierarchy that mirrors a conversation thread. The modular design and use of custom hooks ensure the codebase remains clean, maintainable, and easy to extend.

---

## What is "Regeneration of a Message with a Tree Structure"?

A tree structure organizes messages so that each message (node) can have child messages, forming branches. The application can reconstruct (regenerate) this structure from stored data, so you can always display the full threaded conversation, even after a reload or data fetch.

### Example Structure

```
Root Message
├── Reply 1
│   ├── Reply 1.1
│   └── Reply 1.2
└── Reply 2
    └── Reply 2.1
```

- **Root Message**: The main message or conversation start.
- **Replies**: Each reply is a child node, and can have its own replies (children), forming a tree.

This structure supports complex, nested conversations, making it easy to follow discussion threads.

### Regeneration Process

1. **Data Fetching**: All messages are loaded from the backend (e.g., Supabase).
2. **Tree Construction**: Messages are organized by parent-child relationships to build the tree.
3. **Rendering**: The UI displays the tree, allowing users to see the full conversation context.

---

## Hooks System

The application uses custom React hooks to separate logic and state management from UI components. This improves clarity and testability.

### Key Hooks

- **useChatState**: Manages chat state, including messages, input, loading state, and the current thread.
- **useMessageHandlers**: Encapsulates all message-related logic, such as submitting, regenerating, and paginating messages. This keeps business logic out of UI components.
- **useChat**: Combines state and handlers into a single interface for the main chat component.
- **useScroll**: Handles automatic scrolling to the latest message.

This modular hook system makes it easy to reason about, test, and extend each part of the chat logic independently.

---

## Modular System for Maintainability and Cleanability

The codebase is divided into clear modules:

- **Components**: UI elements like `Chat`, `ChatBubble`, and `ChatSendForm` are small and focused, only handling rendering and user interaction.
- **Hooks**: All logic and state management are handled by hooks, keeping components clean.
- **Utils**: Utility functions for message creation, streaming, and other helpers are in a dedicated library.
- **API**: Backend logic (e.g., OpenAI integration) is isolated in the API route.

This separation ensures:
- Easy updates and bug fixes (change logic in one place, not many).
- Reusability (hooks and utils can be used in other parts of the app).
- Readability (each file and function has a clear responsibility).

---

## How to Run the Application

1. **Install Dependencies**

   ```sh
   npm install
   ```

2. **Set Up Environment Variables**

   Copy `.env.example.local` to `.env` and add your OpenAI API key:

   ```sh
   cp .env.example.local .env
   # Edit .env and set OPENAI_API_KEY=your_openai_api_key
   ```

3. **Start the Development Server**

   ```sh
   npm run dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

---

## Docker Containerization

You can run the frontend in a Docker container for easy deployment and consistent environments.

### Build and Run with Docker

1. **Build the Docker image**

   ```sh
   docker build -t nextjs-frontend .
   ```

2. **Run the container**

   ```sh
   docker run -p 3000:3000 --env-file .env nextjs-frontend
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

### Using Docker Compose

A `docker-compose.yml` is included for convenience:

```sh
docker compose up --build
```

This will build and start the frontend service, using environment variables from your `.env` file.

---

## Technologies Used

- **Next.js (App Router)**
- **React**
- **Tailwind CSS**
- **Shadcn UI**
- **React Hook Form**
- **Zod**

---

This structure and approach ensure the application is robust, easy to maintain, and simple to extend for future features.