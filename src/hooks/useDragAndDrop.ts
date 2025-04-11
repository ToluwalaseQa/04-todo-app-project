import { Task } from '@/types/todo';

interface DragAndDropOptions {
  setDraggedId?: (id: string | null) => void;
  setHoveredId?: (id: string | null) => void;
}

export const useDragAndDrop = (
  tasks: Task[],
  onReorder: (newTasks: Task[]) => void,
  options: DragAndDropOptions = {}
) => {
  const handleDragStart = (task: Task) => {
    console.log('Drag Start - Task ID:', task.id);
    options.setDraggedId?.(task.id);
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    targetId: string
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    console.log('Drag Over - Target ID:', targetId);
    options.setHoveredId?.(targetId);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    console.log('Drop - Target ID:', targetId);
    const draggedId = e.dataTransfer.getData('text/plain');
    console.log('Drop - Dragged ID from dataTransfer:', draggedId);
    console.log(
      'Input Tasks:',
      tasks.map((t) => t.id)
    ); // Add this line

    if (!draggedId || draggedId === targetId) {
      console.log('Drop aborted: No dragged ID or same as target');
      options.setDraggedId?.(null);
      options.setHoveredId?.(null);
      return;
    }

    const draggedIndex = tasks.findIndex((task) => task.id === draggedId);
    const targetIndex = tasks.findIndex((task) => task.id === targetId);

    console.log('Dragged Index:', draggedIndex, 'Target Index:', targetIndex);

    if (draggedIndex === -1 || targetIndex === -1) {
      console.log('Drop aborted: Invalid indices');
      options.setDraggedId?.(null);
      options.setHoveredId?.(null);
      return;
    }

    const reordered = [...tasks];
    const [movedTask] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, movedTask);

    console.log(
      'New Order:',
      reordered.map((t) => t.id)
    );
    onReorder(reordered);

    options.setDraggedId?.(null);
    options.setHoveredId?.(null);
  };

  return { handleDragStart, handleDragOver, handleDrop };
};