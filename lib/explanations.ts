import { Explanation } from '@/types/explanation';

export const todoTutorialExplanations: Explanation[] = [
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
    }
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
    }
  },
  {
    title: "Controlled Input Components",
    timestamp: "4:30",
    whyThisMatters: "Controlled inputs ensure React has full control over form data. This prevents sync issues and makes validation easier.",
    whatsHappening: "The input's value comes from React state, and onChange updates that state. This creates a single source of truth.",
    keyPoint: "Always pair 'value' with 'onChange' - having one without the other causes errors.",
    codeExample: {
      correct: `<input 
  value={inputValue} 
  onChange={(e) => setInputValue(e.target.value)}
/>`,
      incorrect: `// Input becomes read-only without onChange!
<input value={inputValue} />`,
      language: "jsx"
    }
  },
  {
    title: "Rendering Lists with Map",
    timestamp: "6:30",
    whyThisMatters: "Map transforms your data array into UI elements. The key prop helps React efficiently update only changed items.",
    whatsHappening: "For each todo item, map returns a JSX element. React uses keys to track which items changed.",
    keyPoint: "Never use array index as key if items can be reordered or deleted - it causes rendering bugs.",
    codeExample: {
      correct: `{todos.map(todo => (
  <li key={todo.id}>{todo.text}</li>
))}`,
      incorrect: `// Index as key causes bugs when reordering
{todos.map((todo, index) => (
  <li key={index}>{todo.text}</li>
))}`,
      language: "jsx"
    }
  },
  {
    title: "Passing Data to Event Handlers",
    timestamp: "8:20",
    whyThisMatters: "Arrow functions let you pass specific data (like which todo to delete) to event handlers. Without this, you can't identify which item was clicked.",
    whatsHappening: "The arrow function creates a closure that 'remembers' the todo.id value for each button.",
    keyPoint: "onClick needs a function, not a function call - that's why we use () => deleteTodo(id) instead of deleteTodo(id).",
    codeExample: {
      correct: `<button onClick={() => deleteTodo(todo.id)}>
  Delete
</button>`,
      incorrect: `// This calls deleteTodo immediately on render!
<button onClick={deleteTodo(todo.id)}>
  Delete
</button>`,
      language: "jsx"
    }
  },
  {
    title: "Immutable State Updates",
    timestamp: "17:00",
    whyThisMatters: "React only re-renders when it detects a new state object. Mutating the existing array won't trigger updates.",
    whatsHappening: "Filter creates a new array without the deleted item. React sees this new array and knows to re-render.",
    keyPoint: "Always create new arrays/objects when updating state - use spread (...), filter, or map.",
    codeExample: {
      correct: `// Creates new array without the deleted todo
setTodos(todos.filter(todo => todo.id !== todoId));`,
      incorrect: `// Mutates existing array - React won't re-render!
const index = todos.findIndex(t => t.id === todoId);
todos.splice(index, 1);
setTodos(todos);`,
      language: "jsx"
    }
  }
];