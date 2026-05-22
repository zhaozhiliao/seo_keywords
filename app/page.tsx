import Header from "./components/Header";
import SingleQuery from "./components/SingleQuery";
import BatchQuery from "./components/BatchQuery";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6 flex-1">
        <SingleQuery />
        <BatchQuery />
      </main>
      <footer className="text-center text-xs text-gray-400 py-5 border-t border-gray-100">
        仅供个人使用 · Powered by Ahrefs Keywords Explorer API
      </footer>
    </div>
  );
}
