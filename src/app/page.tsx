import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const sections = [
    { id: "hero", name: "Hero Section" },
    { id: "about", name: "About Section" },
    { id: "services", name: "Services Section" },
    { id: "features", name: "Features Section" },
    { id: "testimonials", name: "Testimonials Section" },
    { id: "contact", name: "Contact Section" }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between px-8 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800">
        <div className="flex-1"></div>
        <div className="flex gap-4">
          <Link 
            href="/login"
            className="px-5 py-2 text-sm font-medium text-zinc-950 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            Login
          </Link>
          <Link 
            href="/register"
            className="px-5 py-2 text-sm font-medium text-white bg-black dark:bg-white dark:text-black rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {sections.map((section, index) => (
          <section 
            id={section.id}
            key={index} 
            className="flex min-h-screen w-full items-center justify-center border-b border-gray-200 dark:border-zinc-800 p-8"
          >
            <h2 className="text-4xl font-bold text-black dark:text-white">
              {section.name}
            </h2>
          </section>
        ))}
      </main>
    </div>
  );
}
