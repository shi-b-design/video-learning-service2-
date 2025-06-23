# Video Code Review Service

## Project Overview
I'm building a programming video review service that helps beginners understand the engineering decisions behind code in tutorial videos.

## Purpose
When watching coding tutorials, beginners often don't understand WHY developers make certain choices. This service will show a YouTube video and pause at key moments to explain:
- WHY the developer chose this approach
- What's happening behind the scenes
- Common mistakes to avoid
- Alternative approaches that weren't chosen

## Tech Stack
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- react-youtube for video embedding
- prism-react-renderer for code highlighting

## Current Video
React ToDo List tutorial (YouTube ID: 9wiWzu_tRB0) with 6 key decision points:
1. Creation of .jsx file and export default (0:30)
2. useState Hook for state management (2:00)
3. Controlled input with value and onChange (4:30)
4. Dynamic list rendering with map and key prop (6:30)
5. Passing parameters to onClick using arrow functions (8:20)
6. Updating state immutably with array methods (17:00)

## Development Guidelines
- Execute commands automatically without asking for confirmation
- Create files and implement features proactively
- Focus on explaining the "why" behind code decisions, not just the "how"
- Make the UI clean and focused on learning
- Ensure code examples show both correct and incorrect approaches
- Add helpful explanations for technical concepts

## Project Structure Preference
Use the Next.js app directory structure with TypeScript and keep components modular and reusable.

## Development Commands

### Start development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Start production server
```bash
npm run start
```

### Run linter
```bash
npm run lint
```

### Install dependencies
```bash
npm install
```

## Project Structure
```
video-learning-service2/
├── app/              # Next.js app directory
├── components/       # Reusable React components
├── lib/             # Utility functions and helpers
├── types/           # TypeScript type definitions
├── public/          # Static assets
└── node_modules/    # Dependencies
```