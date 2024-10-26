import LogInSignUpButton from "./LogInSignUpButton";
import { Spotlight } from "./ui/spotlight";

export default function DefaultHome({ titleFont }) {
  return (
    <div>
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        <h1
          className={`${titleFont.className} text-4xl md:text-9xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50`}
        >
          Briefly
        </h1>
        <div className="flex justify-center mt-8">
          <LogInSignUpButton />
        </div>
      </div>
    </div>
  );
}