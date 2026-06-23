export default function Header() {
  return (
    <header className="m-4 mb-0 rounded-[28px] bg-white/70 backdrop-blur-xl border border-pink-100 px-8 py-5 flex items-center justify-between shadow-lg">

      <div>
        <h2 className="font-black text-2xl text-slate-800">
          Welcome Back 👋
        </h2>

        <p className="text-slate-500 text-sm">
          Here's what's happening today.
        </p>
      </div>

      <div className="flex items-center gap-4">

        <input
          placeholder="Search..."
          className="px-5 py-3 rounded-2xl border border-pink-100 bg-white focus:outline-none focus:ring-4 focus:ring-pink-200"
        />

        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold">
          A
        </div>

      </div>

    </header>
  );
}