import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        <div
          className='fixed inset-0 transition-opacity'
          aria-hidden='true'
          onClick={onClose}
        >
          <div className='absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-75'></div>
        </div>

        <span
          className='hidden sm:inline-block sm:align-middle sm:h-screen'
          aria-hidden='true'
        >
          &#8203;
        </span>

        <div
          className={twMerge(
            'inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full dark:bg-gray-800',
            className
          )}
        >
          <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 dark:bg-gray-800'>
            <div className='flex justify-between items-start'>
              <h3 className='text-lg leading-6 font-medium text-gray-900 dark:text-white'>
                {title}
              </h3>
              <button
                onClick={onClose}
                className='text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200'
              >
                <span className='sr-only'>Close</span>
                <svg
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
            <div className='mt-4'>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
