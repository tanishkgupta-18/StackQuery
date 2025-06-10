'use client';

import Link from 'next/link';
import ShimmerButton from "@/components/magicui/shimmer-button";
export default function Home() {
  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-indigo-800 via-indigo-900 to-black opacity-80"></div>
      <div className="absolute inset-0 z-0 bg-[url('https://source.unsplash.com/1600x900/?code,technology')] bg-cover bg-center opacity-30"></div>

      {/* Hero Section */}
      <section className="relative z-10 flex items-center justify-center h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl font-bold sm:text-5xl leading-tight">
            <span className="text-indigo-500">StackQuery</span> – Your go-to platform for developer Q&A
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-300">
            Dive into a community-driven space where developers share knowledge, solve problems, and grow together.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/questions/ask">
              <ShimmerButton className="shadow-xl backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <span className="text-white text-sm lg:text-lg font-medium leading-none tracking-tight">
                  Ask a question
                </span>
              </ShimmerButton>
            </Link>
            <Link href="/questions">
              <ShimmerButton className="shadow-xl backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <span className="text-white text-sm lg:text-lg font-medium leading-none tracking-tight">
                  Browse questions
                </span>
              </ShimmerButton>
            </Link>
          </div>
        </div>
      </section>
    </main >
  );
}
