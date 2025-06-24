export default function VideoSuggestions({ onSelectVideo }: { onSelectVideo: (url: string) => void }) {
  const suggestions = [
    {
      title: "React Todo List Tutorial",
      url: "https://www.youtube.com/watch?v=9wiWzu_tRB0",
      description: "Original tutorial - known to have captions"
    },
    {
      title: "Learn React in 2024",
      url: "https://www.youtube.com/watch?v=SqcY0GlETPk",
      description: "Programming with Mosh - usually has good captions"
    },
    {
      title: "JavaScript Tutorial",
      url: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
      description: "1 hour JavaScript tutorial with captions"
    },
    {
      title: "Python for Beginners",
      url: "https://www.youtube.com/watch?v=rfscVS0vtbw",
      description: "freeCodeCamp tutorial with reliable captions"
    }
  ];

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Try these videos (known to have captions):</h3>
      <div className="space-y-2">
        {suggestions.map((video, index) => (
          <button
            key={index}
            onClick={() => onSelectVideo(video.url)}
            className="w-full text-left p-2 bg-white rounded border border-gray-200 hover:border-blue-400 transition-colors"
          >
            <div className="font-medium text-sm">{video.title}</div>
            <div className="text-xs text-gray-600">{video.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}