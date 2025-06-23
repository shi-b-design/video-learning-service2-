import VideoLearningInterface from '@/components/VideoLearningInterface';
import { todoTutorialExplanations } from '@/lib/explanations';

export default function Home() {
  return (
    <main className="min-h-screen">
      <VideoLearningInterface 
        videoId="9wiWzu_tRB0"
        explanations={todoTutorialExplanations}
      />
    </main>
  )
}