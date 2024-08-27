import React from 'react';
import { motion } from 'framer-motion';

const languages = [
  { code: 'spanish', name: 'Spanish', flag: '🇪🇸' },
  { code: 'japanese', name: 'Japanese', flag: '🇯🇵' },
  { code: 'italian', name: 'Italian', flag: '🇮🇹' },
  { code: 'german', name: 'German', flag: '🇩🇪' },
];

const LanguageSelector = ({ onSelectLanguage }) => {
  return (
    <div className="max-w-2xl mx-auto p-4 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center">Choose a Language</h1>
      <div className="grid grid-cols-2 gap-4">
        {languages.map((lang) => (
          <motion.button
            key={lang.code}
            className="bg-white border-2 border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-gray-100"
            onClick={() => onSelectLanguage(lang.code)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-4xl mb-2">{lang.flag}</span>
            <span className="text-xl font-semibold">{lang.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;