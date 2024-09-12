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

    <style>
      @import url('https://fonts.googleapis.com/css2?family=Handjet:wght@100..900&display=swap');
    </style>
    
    <NewsApp />
  </div>
  );
}