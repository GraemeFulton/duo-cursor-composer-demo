"use client";

import LanguageLearningGame from '../components/LanguageLearningGame';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-8 relative">
      <LanguageLearningGame />
      
      {/* Floating card */}
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs w-64">
        <a 
          href="https://prototypr.io/post/cursor-composer-cmdi"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/og.png"
            alt="Cursor Composer and Claude"
            width={256}
            height={128}
            className="rounded-lg mb-2 w-full h-auto"
          />
          <h2 className="text-sm font-semibold tracking-tight text-gray-900 mb-2">How to Build Full Apps with AI</h2>
          <p className="text-gray-800 text-sm font-normal mb-2">
            See how this app was made with Cursor Composer and Claude 
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full">
            Read now
          </button>
        </a>
      </div>
    </main>
  );
}