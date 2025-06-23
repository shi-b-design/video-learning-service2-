import { EnhancedExplanation } from '@/types/enhanced-explanation';

export const denseExplanations: EnhancedExplanation[] = [
  {
    title: "Starting a New React Project",
    timestamp: "0:00",
    whyThisMatters: "Understanding the project setup helps you know what tools and files you're working with from the start.",
    whatsHappening: "The developer is opening their code editor and navigating to create a new React component.",
    keyPoint: "Every React project starts with creating components - they're the building blocks of your app.",
    concepts: ["react", "project setup", "components"],
    difficulty: "beginner"
  },
  {
    title: "Creating the Components Folder",
    timestamp: "0:10",
    whyThisMatters: "Organizing files in folders keeps large projects manageable. A 'components' folder is a React convention.",
    whatsHappening: "A new folder called 'components' is being created to hold all React component files.",
    keyPoint: "Always organize your components in a dedicated folder - it makes finding files much easier later.",
    concepts: ["folder structure", "organization", "best practices"],
    difficulty: "beginner"
  },
  {
    title: "Naming the Component File",
    timestamp: "0:20",
    whyThisMatters: "Component names should be clear and descriptive. 'TodoList' immediately tells other developers what this component does.",
    whatsHappening: "The file is named 'TodoList.jsx' - using PascalCase (capital first letters) which is the React convention.",
    keyPoint: "Always use PascalCase for component names: TodoList, not todolist or todo-list.",
    concepts: ["naming conventions", "PascalCase", "jsx files"],
    difficulty: "beginner"
  },
  {
    title: "Creating a React Component File",
    timestamp: "0:30",
    whyThisMatters: "Creating separate component files keeps code organized and reusable. Without export default, you can't use the component in other files.",
    whatsHappening: "export default tells JavaScript \"this is the main thing from this file that other files can import\"",
    keyPoint: "Always remember to export your components, or you'll get import errors.",
    codeExample: {
      correct: `// TodoList.jsx
export default function TodoList() {
  return <div>My Todo List</div>;
}`,
      incorrect: `// Missing export - other files can't use this!
function TodoList() {
  return <div>My Todo List</div>;
}`,
      language: "jsx"
    },
    concepts: ["export default", "modules", "component creation"],
    difficulty: "beginner"
  },
  {
    title: "Writing the Function Signature",
    timestamp: "0:40",
    whyThisMatters: "Function components are the modern way to write React. They're simpler than class components and support hooks.",
    whatsHappening: "The developer types 'function TodoList()' - creating a JavaScript function that will return JSX.",
    keyPoint: "React components are just functions that return JSX - nothing magical about them!",
    codeChange: {
      before: "",
      after: "function TodoList() {",
      lineNumbers: [1]
    },
    concepts: ["function components", "jsx", "component syntax"],
    difficulty: "beginner"
  },
  {
    title: "Opening the Return Statement",
    timestamp: "0:50",
    whyThisMatters: "Every React component must return something - usually JSX that describes what should appear on screen.",
    whatsHappening: "The return statement is where you define what the component will display.",
    keyPoint: "If a component doesn't return anything, nothing will appear on screen!",
    codeChange: {
      before: "function TodoList() {",
      after: "function TodoList() {\n  return (",
      lineNumbers: [2]
    },
    relatedTo: ["0:40"],
    concepts: ["return statement", "jsx", "rendering"],
    difficulty: "beginner"
  },
  {
    title: "Creating the Container Div",
    timestamp: "1:00",
    whyThisMatters: "React components must return a single parent element. A container div is the most common solution.",
    whatsHappening: "Adding a <div> element as the root container for all the todo list content.",
    keyPoint: "Always wrap multiple elements in a single parent - React needs one root element.",
    codeChange: {
      before: "  return (",
      after: "  return (\n    <div>",
      lineNumbers: [3]
    },
    concepts: ["jsx elements", "container elements", "react fragments"],
    difficulty: "beginner"
  },
  {
    title: "Adding the Title",
    timestamp: "1:10",
    whyThisMatters: "User interfaces need clear titles. An h1 tag is semantically correct for the main heading.",
    whatsHappening: "Adding an <h1> element with the text 'Todo List' inside the container div.",
    keyPoint: "Use semantic HTML tags (h1, h2, etc.) for better accessibility and SEO.",
    codeChange: {
      before: "    <div>",
      after: "    <div>\n      <h1>Todo List</h1>",
      lineNumbers: [4]
    },
    relatedTo: ["1:00"],
    concepts: ["semantic html", "headings", "accessibility"],
    difficulty: "beginner"
  },
  {
    title: "Preparing for Dynamic Content",
    timestamp: "1:20",
    whyThisMatters: "Static content is just the start. Real apps need to handle dynamic data that changes based on user actions.",
    whatsHappening: "The developer pauses to think about how to make the todo list interactive, not just static HTML.",
    keyPoint: "Plan for interactivity from the start - static components are rarely useful in real apps.",
    concepts: ["planning", "interactivity", "dynamic content"],
    difficulty: "intermediate"
  },
  {
    title: "Importing React and useState",
    timestamp: "1:30",
    whyThisMatters: "Hooks like useState are how functional components manage data that changes over time.",
    whatsHappening: "Adding import statements at the top of the file to bring in React's useState hook.",
    keyPoint: "Always import what you need at the top of the file - it's cleaner and easier to see dependencies.",
    codeChange: {
      before: "export default function TodoList() {",
      after: "import { useState } from 'react';\n\nexport default function TodoList() {",
      lineNumbers: [1]
    },
    concepts: ["imports", "hooks", "useState", "dependencies"],
    difficulty: "beginner"
  },
  {
    title: "Thinking About State Structure",
    timestamp: "1:40",
    whyThisMatters: "Choosing the right data structure for your state is crucial. Arrays are perfect for lists of items.",
    whatsHappening: "The developer is considering how to structure the todo items - an array of objects is the logical choice.",
    keyPoint: "Think about your data structure before coding - it's harder to change later.",
    relatedTo: ["1:30"],
    concepts: ["state design", "data structures", "arrays", "planning"],
    difficulty: "intermediate"
  },
  {
    title: "Declaring the Todos State",
    timestamp: "1:50",
    whyThisMatters: "State declaration with useState creates reactive variables that trigger re-renders when changed.",
    whatsHappening: "Using array destructuring to create 'todos' (the current value) and 'setTodos' (the updater function).",
    keyPoint: "The naming convention is [value, setValue] - this makes your code predictable.",
    codeChange: {
      before: "export default function TodoList() {",
      after: "export default function TodoList() {\n  const [todos, setTodos] = useState([]);",
      lineNumbers: [3]
    },
    relatedTo: ["1:30", "1:40"],
    concepts: ["useState", "destructuring", "state initialization", "naming conventions"],
    difficulty: "beginner"
  },
  {
    title: "Using useState for Dynamic Data",
    timestamp: "2:00",
    whyThisMatters: "useState lets components remember information between renders. Without it, your todo list would reset every time React re-renders.",
    whatsHappening: "useState creates a special variable that React watches. When you update it, React knows to re-render with the new value.",
    keyPoint: "Always use setState to update state values - never modify them directly!",
    codeExample: {
      correct: `const [todos, setTodos] = useState([]);

// Add new todo correctly
setTodos([...todos, newTodo]);`,
      incorrect: `// Wrong! This won't trigger re-render
todos.push(newTodo);`,
      language: "jsx"
    },
    relatedTo: ["1:50", "1:30"],
    concepts: ["useState", "state management", "reactivity", "immutability"],
    difficulty: "beginner"
  },
  {
    title: "Adding Input State",
    timestamp: "2:10",
    whyThisMatters: "Forms need their own state to track what the user is typing before they submit.",
    whatsHappening: "Creating a second piece of state specifically for the input field value.",
    keyPoint: "Separate concerns - todo list state and input state serve different purposes.",
    codeChange: {
      before: "  const [todos, setTodos] = useState([]);",
      after: "  const [todos, setTodos] = useState([]);\n  const [inputValue, setInputValue] = useState('');",
      lineNumbers: [4]
    },
    relatedTo: ["1:50", "2:00"],
    concepts: ["form state", "controlled components", "separation of concerns"],
    difficulty: "beginner"
  }
];