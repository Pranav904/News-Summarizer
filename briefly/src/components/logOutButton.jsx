export default function LogOutButton() {
  return (
      <button className="mr-8 shadow-[0_4px_14px_0_rgb(0,0,0,10%)] hover:shadow-[0_6px_20px_rgba(93,93,93,23%)] px-8 py-2 bg-[#fff] rounded-md font-bold transition duration-200 ease-linear transform hover:-translate-y-1 transition duration-400">
        <a href="/api/auth/logout">Log Out</a>
      </button>
  );
}