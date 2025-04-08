import { useState } from 'react';

export const useDragAndDrop = (
  initialItems: any[],
  onReorder: (items: any[]) => void
) => {
  const [draggedItem, setDraggedItem] = useState<any>(null);

  const handleDragStart = (item: any) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (!draggedItem) return;

    const currentIndex = initialItems.findIndex(
      (item) => item.id === draggedItem.id
    );
    if (currentIndex === -1 || currentIndex === targetIndex) return;

    const newItems = [...initialItems];
    newItems.splice(currentIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);

    onReorder(newItems);
    setDraggedItem(null);
  };

  return { handleDragStart, handleDragOver, handleDrop };
};
