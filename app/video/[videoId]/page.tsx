import DynamicVideoLearning from '@/components/DynamicVideoLearning';

export default async function VideoPage({ params }: { params: Promise<{ videoId: string }> }) {
  const { videoId } = await params;
  
  return (
    <main className="min-h-screen">
      <DynamicVideoLearning videoId={videoId} />
    </main>
  );
}