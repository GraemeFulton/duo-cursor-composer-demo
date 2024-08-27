import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
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
            <p className="mb-4">{message}</p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-green-500 text-white rounded-2xl px-6 py-3 font-bold hover:bg-green-600"
                onClick={onConfirm}
              >
                Confirm
              </button>
              <button
                className="bg-red-500 text-white rounded-2xl px-6 py-3 font-bold hover:bg-red-600"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;