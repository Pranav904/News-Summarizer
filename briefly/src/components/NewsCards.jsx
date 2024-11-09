import Recommendations from "./Recommendations";

export default function NewsCards({ selectedTags }) {
  return (
    <div className="p-2 md:p-10 rounded-t-2xl md:rounded-l-2xl w-full flex flex-col gap-2 flex-1 dark:bg-black bg-white dark:bg-grid-white/[0.1] bg-grid-black/[0.1] relative overflow-y-auto">
      {/* <div className="rounded-l-2xl absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div> */}
      <div className="h-screen flex flex-col overflow-y-auto">
          <div className="flex justify-between hidden md:block">
            <h1
              className={`font-[family-name:var(--font-alex-brush)] text-5xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50`}
            >
              Briefly
            </h1>
          </div>
          <Recommendations selectedTags={selectedTags} />
        </div>
    </div>
  );
}
