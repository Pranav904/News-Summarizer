import NewsApp from '../components/NewsApp';

export default function Home() {
  return (
    <div>
    <style jsx global>{`
      body {
        margin: 0px;
        padding: 0px;
      }
    `}</style>
    <NewsApp />
  </div>
  );
}