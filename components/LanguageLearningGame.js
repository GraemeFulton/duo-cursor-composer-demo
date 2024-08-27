"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import HeartTracker from './HeartTracker';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import LanguageSelector from './LanguageSelector';
import ConfirmationModal from './ConfirmationModal';
import { spanishPhrases } from '../data/spanishPhrases';
import { japanesePhrases } from '../data/japanesePhrases';
import { italianPhrases } from '../data/italianPhrases';
import { germanPhrases } from '../data/germanPhrases';

const phrases = {
  spanish: spanishPhrases,
  japanese: japanesePhrases,
  italian: italianPhrases,
  german: germanPhrases,
};

export default function LanguageLearningGame() {
  const [currentLanguage, setCurrentLanguage] = useState(null);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState([]);
  const [wordStates, setWordStates] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [hearts, setHearts] = useState(3);
  const [audioContext, setAudioContext] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [newLanguage, setNewLanguage] = useState(null);
  const [draggedWord, setDraggedWord] = useState(null);

  useEffect(() => {
    if (currentLanguage) {
      setAudioContext(new (window.AudioContext || window.webkitAudioContext)());
      resetGame();
    }
  }, [currentLanguage, currentPhraseIndex]); // Add currentPhraseIndex as a dependency

  const resetGame = () => {
    if (!currentLanguage) return;
    const currentPhrase = phrases[currentLanguage][currentPhraseIndex];
    setUserAnswer([]);
    setIsCorrect(null);
    
    // Get the correct words from the English phrase
    const correctWords = currentPhrase.english.split(' ');
    
    // Get additional words from the 'words' array, excluding the correct words
    const additionalWords = currentPhrase.words.filter(word => !correctWords.includes(word));
    
    // Randomly select a larger subset of additional words (e.g., 5-8 extra words)
    const extraWords = additionalWords
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 4) + 5);
    
    // Combine correct words and extra words, then shuffle
    const allWords = [...correctWords, ...extraWords].sort(() => Math.random() - 0.5);
    
    setWordStates(allWords.map(word => ({ word, isUsed: false })));
  };

  const handleWordClick = (word) => {
    setUserAnswer([...userAnswer, word]);
    setWordStates(wordStates.map(ws => 
      ws.word === word ? { ...ws, isUsed: true } : ws
    ));
  };

  const handleSelectedWordClick = (word) => {
    setUserAnswer(userAnswer.filter(w => w !== word));
    setWordStates(wordStates.map(ws => 
      ws.word === word ? { ...ws, isUsed: false } : ws
    ));
  };

  const checkAnswer = () => {
    const isCorrect = userAnswer.join(' ') === phrases[currentLanguage][currentPhraseIndex].english;
    setIsCorrect(isCorrect);
    if (isCorrect) {
      playSound(true);
      setTimeout(() => {
        setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases[currentLanguage].length);
        resetGame();
      }, 1500);
    } else {
      playSound(false);
      setHearts(hearts - 1);
      if (hearts - 1 === 0) {
        playSound(false, true);
        setIsGameOver(true);
      }
    }
  };

  const handleGameOver = () => {
    setIsGameOver(false);
    setHearts(3);
    setCurrentPhraseIndex(0);
    resetGame();
  };

  const speakPhrase = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage === 'spanish' ? 'es-ES' :
                       currentLanguage === 'japanese' ? 'ja-JP' :
                       currentLanguage === 'italian' ? 'it-IT' :
                       'de-DE';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    } else {
      console.log("Text-to-speech not supported in this browser.");
    }
  };

  const playSound = (isVictory, isGameOver = false) => {
    if (audioContext) {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      if (isGameOver) {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(349.23, audioContext.currentTime + 0.3);
        oscillator.frequency.setValueAtTime(293.66, audioContext.currentTime + 0.6);
        gainNode.gain.setValueAtTime(1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 2);
      } else if (isVictory) {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(554.37, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.7, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
      } else {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(415.30, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.7, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
      }
    }
  };

  const handleLanguageChange = (language) => {
    setNewLanguage(language);
    setShowConfirmationModal(true);
  };

  const confirmLanguageChange = () => {
    setCurrentLanguage(newLanguage);
    setShowConfirmationModal(false);
    setCurrentPhraseIndex(0);
    setHearts(3);
    resetGame();
  };

  const handleReorder = (reorderedWords) => {
    setUserAnswer(reorderedWords);
    
    const newWordStates = wordStates.map(ws => ({
      ...ws,
      isUsed: reorderedWords.includes(ws.word)
    }));
    setWordStates(newWordStates);
    setDraggedWord(null);
  };

  if (!currentLanguage) {
    return <LanguageSelector onSelectLanguage={setCurrentLanguage} />;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 font-sans">
      <div className="flex justify-between items-center mb-4">
        <HeartTracker hearts={hearts} />
        <select
          className="bg-white border border-gray-300 rounded-md px-2 py-1"
          onChange={(e) => handleLanguageChange(e.target.value)}
          value={currentLanguage}
        >
          <option value={currentLanguage}>{currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1)}</option>
          <option value="">Change Language</option>
        </select>
      </div>
      <div className="bg-gray-200 h-2 rounded-full mb-6">
        <div className="bg-green-500 h-2 rounded-full" style={{width: `${((currentPhraseIndex + 1) / phrases[currentLanguage].length) * 100}%`}}></div>
      </div>
      <h1 className="text-2xl font-bold mb-6">Write this in English</h1>
      <div className="flex items-center mb-6">
        <Image 
          src={`/${phrases[currentLanguage][currentPhraseIndex].character}.png`} 
          alt="Avatar" 
          width={80} 
          height={80} 
          className="mr-4" 
        />
        <div className="bg-white border border-gray-300 rounded-3xl p-4">
          <button 
            onClick={() => speakPhrase(phrases[currentLanguage][currentPhraseIndex][currentLanguage])}
            className="text-blue-500 mr-2 focus:outline-none"
            aria-label="Listen to phrase"
          >
            🔊
          </button>
          {phrases[currentLanguage][currentPhraseIndex][currentLanguage]}
        </div>
      </div>
      <Reorder.Group 
        axis="x" 
        values={userAnswer} 
        onReorder={handleReorder} 
        className="flex flex-wrap gap-2 mb-6 min-h-[50px]"
      >
        <AnimatePresence>
          {userAnswer.map((word) => (
            <Reorder.Item 
              key={word} 
              value={word} 
              className="relative"
              onDragStart={() => setDraggedWord(word)}
              onDragEnd={() => setDraggedWord(null)}
            >
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
                  onClick={(e) => {
                    if (draggedWord !== word) {
                      handleSelectedWordClick(word);
                    }
                  }}
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
        {wordStates.map((wordState, index) => (
          <motion.div 
            key={index}
            className={`rounded-2xl ${wordState.isUsed ? 'bg-gray-300' : 'bg-white border-2 border-gray-300'}`}
          >
            <motion.button 
              className={`rounded-2xl px-4 py-2 ${wordState.isUsed ? 'text-gray-300' : 'hover:bg-gray-100'}`}
              onClick={() => !wordState.isUsed && handleWordClick(wordState.word)}
              whileHover={!wordState.isUsed ? { scale: 1.05 } : {}}
              whileTap={!wordState.isUsed ? { scale: 0.95 } : {}}
              disabled={wordState.isUsed}
            >
              {wordState.word}
            </motion.button>
          </motion.div>
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
      
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-8 rounded-lg text-center"
            >
              <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
              <p className="mb-4">You've run out of hearts.</p>
              <button
                className="bg-green-500 text-white rounded-2xl px-6 py-3 font-bold hover:bg-green-600"
                onClick={handleGameOver}
              >
                Play Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={confirmLanguageChange}
        message={`Are you sure you want to change the language to ${newLanguage}? Your progress will be reset.`}
      />
    </div>
  );
}