// Sample transcripts for demonstration
// In production, these would be fetched dynamically

export const sampleTranscripts: Record<string, any[]> = {
  // React Todo List Tutorial
  '9wiWzu_tRB0': [
    { timestamp: "0:00", text: "Welcome everyone, today we're going to build a simple todo list application in React.", startTime: 0, duration: 5 },
    { timestamp: "0:05", text: "This is a great beginner project to understand React fundamentals.", startTime: 5, duration: 5 },
    { timestamp: "0:10", text: "Let me create a new components folder to organize our code.", startTime: 10, duration: 5 },
    { timestamp: "0:15", text: "I'll create a new file called TodoList.jsx inside the components folder.", startTime: 15, duration: 5 },
    { timestamp: "0:20", text: "Now let's start by creating a functional component. I'll type function TodoList.", startTime: 20, duration: 5 },
    { timestamp: "0:25", text: "And we need to export this component so we can use it in other files.", startTime: 25, duration: 5 },
    { timestamp: "0:30", text: "I'll add export default at the beginning. This makes it the default export from this file.", startTime: 30, duration: 5 },
    { timestamp: "0:35", text: "Inside the function, we'll return some JSX. Let me add a return statement.", startTime: 35, duration: 5 },
    { timestamp: "0:40", text: "For now, let's just return a div with an h1 that says Todo List.", startTime: 40, duration: 5 },
    { timestamp: "0:45", text: "Now we need to make this interactive. React components need state to handle changing data.", startTime: 45, duration: 5 },
    { timestamp: "0:50", text: "Let me import useState from React at the top of the file.", startTime: 50, duration: 5 },
    { timestamp: "0:55", text: "useState is a React Hook that lets us add state to functional components.", startTime: 55, duration: 5 },
    { timestamp: "1:00", text: "Now I'll create a state variable for our todos. const todos, setTodos equals useState.", startTime: 60, duration: 5 },
    { timestamp: "1:05", text: "We'll initialize it with an empty array since we don't have any todos yet.", startTime: 65, duration: 5 },
    { timestamp: "1:10", text: "We also need state for the input field. Let me create another state variable.", startTime: 70, duration: 5 },
    { timestamp: "1:15", text: "const inputValue, setInputValue equals useState with an empty string.", startTime: 75, duration: 5 },
    { timestamp: "1:20", text: "Now let's add an input field to our JSX so users can type new todos.", startTime: 80, duration: 5 },
    { timestamp: "1:25", text: "I'll add an input element with type text.", startTime: 85, duration: 5 },
    { timestamp: "1:30", text: "This input needs to be controlled, so I'll set its value to inputValue.", startTime: 90, duration: 5 },
    { timestamp: "1:35", text: "And we need an onChange handler to update the state when the user types.", startTime: 95, duration: 5 },
    { timestamp: "1:40", text: "onChange equals an arrow function that takes the event parameter.", startTime: 100, duration: 5 },
    { timestamp: "1:45", text: "Inside, we'll call setInputValue with e.target.value.", startTime: 105, duration: 5 },
    { timestamp: "1:50", text: "Now let's add a button to add new todos. I'll create an Add button.", startTime: 110, duration: 5 },
    { timestamp: "1:55", text: "We need a function to handle adding todos. Let me create handleAddTodo.", startTime: 115, duration: 5 },
    { timestamp: "2:00", text: "This function will update our todos state by creating a new array with the new todo.", startTime: 120, duration: 5 }
  ],
  
  // Generic fallback for any video
  'default': [
    { timestamp: "0:00", text: "This is a sample transcript for demonstration purposes.", startTime: 0, duration: 5 },
    { timestamp: "0:05", text: "When properly configured, real transcripts will be fetched from YouTube.", startTime: 5, duration: 5 },
    { timestamp: "0:10", text: "The application analyzes the transcript to provide coding explanations.", startTime: 10, duration: 5 },
    { timestamp: "0:15", text: "Each moment is explained to help beginners understand the code.", startTime: 15, duration: 5 },
    { timestamp: "0:20", text: "Try using the original React Todo List tutorial video for the best experience.", startTime: 20, duration: 5 }
  ]
};

export function getSampleTranscript(videoId: string) {
  return sampleTranscripts[videoId] || sampleTranscripts['default'];
}