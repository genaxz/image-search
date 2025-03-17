import dynamic from 'next/dynamic';

const GiphyMain = dynamic(() => import('../containers/GiphyMain'), {
  loading: () => <p>Loading...</p>,
});

export default function Home() {
  return <GiphyMain />;
}
