"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import HeartTracker from './HeartTracker';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

const phrases = [
  { 
    spanish: "Él es un niño.",
    english: "He is a boy",
    words: ["He", "is", "a", "boy", "girl", "man", "woman", "child", "the", "she", "it", "are", "baby", "person", "kid"],
    character: "avatar1"
  },
  { 
    spanish: "Ella come una manzana.",
    english: "She eats an apple",
    words: ["She", "eats", "an", "apple", "banana", "orange", "pear", "fruit", "the", "he", "they", "eat", "drinks", "bites", "peach", "grape"],
    character: "avatar2"
  },
  { 
    spanish: "El gato duerme.",
    english: "The cat sleeps",
    words: ["The", "cat", "sleeps", "dog", "runs", "jumps", "eats", "drinks", "a", "naps", "rests", "lies", "sits", "animal", "pet", "kitten"],
    character: "avatar3"
  },
  { 
    spanish: "Nosotros hablamos español.",
    english: "We speak Spanish",
    words: ["We", "speak", "Spanish", "English", "French", "German", "Italian", "they", "I", "you", "talk", "learn", "study", "language", "fluently", "practice"],
    character: "avatar4"
  },
  { 
    spanish: "Ellos juegan al fútbol.",
    english: "They play soccer",
    words: ["They", "play", "soccer", "football", "basketball", "tennis", "we", "he", "she", "game", "sport", "ball", "field", "team", "match", "goal"],
    character: "avatar5"
  },
  // Add more phrases with extended word lists
  { 
    spanish: "Yo leo un libro.",
    english: "I read a book",
    words: ["I", "read", "a", "book", "write", "magazine", "newspaper", "story", "novel", "article", "he", "she", "they", "we", "page", "chapter"],
    character: "avatar6"
  },
  { 
    spanish: "Tú escribes una carta.",
    english: "You write a letter",
    words: ["You", "write", "a", "letter", "email", "message", "note", "paper", "pen", "pencil", "type", "send", "receive", "compose", "draft", "mail"],
    character: "avatar7"
  },
  { 
    spanish: "El perro corre rápido.",
    english: "The dog runs fast",
    words: ["The", "dog", "runs", "fast", "slow", "walks", "jumps", "cat", "animal", "pet", "quickly", "slowly", "sprints", "moves", "races", "speed"],
    character: "avatar8"
  },
  { 
    spanish: "La niña canta una canción.",
    english: "The girl sings a song",
    words: ["The", "girl", "sings", "a", "song", "boy", "woman", "man", "music", "melody", "voice", "lyrics", "tune", "sing", "hums", "performs"],
    character: "avatar7"
  },
  { 
    spanish: "Nosotros cocinamos la cena.",
    english: "We cook dinner",
    words: ["We", "cook", "dinner", "lunch", "breakfast", "meal", "food", "prepare", "eat", "they", "he", "she", "kitchen", "recipe", "dish", "ingredients"],
    character: "avatar3"
  }
];

export default function LanguageLearningGame() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [hearts, setHearts] = useState(3);

  useEffect(() => {
    resetGame();
  }, [currentPhraseIndex]);

  const resetGame = () => {
    const currentPhrase = phrases[currentPhraseIndex];
    setUserAnswer([]);
    setIsCorrect(null);
    
    // Make sure we're using a fresh copy of the words array
    const shuffledWords = [...currentPhrase.words].sort(() => Math.random() - 0.5);
    setAvailableWords(shuffledWords);
  };

  const handleWordClick = (word) => {
    setUserAnswer([...userAnswer, word]);
    setAvailableWords(availableWords.filter(w => w !== word));
  };

  const handleSelectedWordClick = (word) => {
    setUserAnswer(userAnswer.filter(w => w !== word));
    setAvailableWords([...availableWords, word].sort(() => Math.random() - 0.5));
  };

  const checkAnswer = () => {
    const isCorrect = userAnswer.join(' ') === phrases[currentPhraseIndex].english;
    setIsCorrect(isCorrect);
    if (isCorrect) {
      setTimeout(() => {
        setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        resetGame();
      }, 1500);
    } else {
      setHearts(hearts - 1);
      if (hearts - 1 === 0) {
        // Game over logic here
        alert("Game Over! You've run out of hearts.");
        setHearts(3);
        setCurrentPhraseIndex(0);
        resetGame();
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 font-sans">
      <HeartTracker hearts={hearts} />
      <div className="bg-gray-200 h-2 rounded-full mb-6">
        <div className="bg-green-500 h-2 rounded-full" style={{width: `${((currentPhraseIndex + 1) / phrases.length) * 100}%`}}></div>
      </div>
      <h1 className="text-2xl font-bold mb-6">Write this in English</h1>
      <div className="flex items-center mb-6">
        <Image 
          src={`/${phrases[currentPhraseIndex].character}.png`} 
          alt="Avatar" 
          width={80} 
          height={80} 
          className="mr-4" 
        />
        <div className="bg-white border border-gray-300 rounded-3xl p-4">
          <span className="text-blue-500 mr-2">🔊</span> {phrases[currentPhraseIndex].spanish}
        </div>
      </div>
      <Reorder.Group axis="x" values={userAnswer} onReorder={setUserAnswer} className="flex flex-wrap gap-2 mb-6 min-h-[50px]">
        <AnimatePresence>
          {userAnswer.map((word) => (
            <Reorder.Item key={word} value={word} className="relative">
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  opacity: { duration: 0.2 },
                  layout: { duration: 0.2, type: "spring", stiffness: 300, damping: 30 }
                }}
              >
                <motion.button 
                  className="bg-white border-2 border-gray-300 rounded-2xl px-4 py-2 hover:bg-gray-100 cursor-move"
                  onClick={() => handleSelectedWordClick(word)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {word}
                </motion.button>
              </motion.div>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
      <div className="flex flex-wrap gap-2 mb-6">
        {availableWords.map((word, index) => (
          <motion.button 
            key={index}
            className="bg-white border-2 border-gray-300 rounded-2xl px-4 py-2 hover:bg-gray-100"
            onClick={() => handleWordClick(word)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {word}
          </motion.button>
        ))}
      </div>
      <button 
        className="bg-green-500 text-white rounded-2xl px-6 py-3 font-bold hover:bg-green-600"
        onClick={checkAnswer}
      >
        CHECK
      </button>
      {isCorrect !== null && (
        <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isCorrect ? 'Correct!' : 'Try again!'}
        </div>
      )}
    </div>
  );
}