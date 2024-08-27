import React from 'react';

export default function HeartTracker({ hearts }) {
  return (
    <div className="flex mb-4">
      {[...Array(3)].map((_, index) => (
        <span key={index} className="text-2xl mr-2">
          {index < hearts ? '❤️' : '🖤'}
        </span>
      ))}
    </div>
  );
}