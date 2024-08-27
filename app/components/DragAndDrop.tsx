import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// ... existing imports and type definitions ...

const DragAndDrop: React.FC<DragAndDropProps> = ({ words, onOrderChange }) => {
  const [orderedWords, setOrderedWords] = useState(words);

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const newItems = Array.from(orderedWords);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setOrderedWords(newItems);
    onOrderChange(newItems);
  };

  // ... rest of the component remains the same ...
};

export default DragAndDrop;