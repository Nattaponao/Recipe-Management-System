import AIPage from '@/components/AIPage';

export default async function Page() {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return <AIPage />;
}
