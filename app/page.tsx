import FastVideoLearning from '@/components/FastVideoLearning';

export default function Home() {
  // Using static transcript from video-transcripts.ts
  return (
    <main className="min-h-screen">
      <FastVideoLearning videoId="9wiWzu_tRB0" />
    </main>
  );
}