'use client';

import React, { useState } from 'react';
import Modal  from '../ui/Modal';
import Input  from '../ui/Input';
import  Button  from '../ui/Button';
import  Select from '../ui/Select';
import { SharedWith } from '@/types/todo';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  sharedWith: SharedWith[];
  onShareChange: (sharedWith: SharedWith[]) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  sharedWith,
  onShareChange,
}) => {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<'view' | 'edit'>('view');

  const handleAddShare = () => {
    if (!email.trim()) return;
    const newSharedWith = [
      ...sharedWith,
      {
        userId: Date.now().toString(), // In real app, this would be from API
        email,
        permission,
      },
    ];
    onShareChange(newSharedWith);
    setEmail('');
  };

  const handleRemoveShare = (userId: string) => {
    const newSharedWith = sharedWith.filter((user) => user.userId !== userId);
    onShareChange(newSharedWith);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Share Task'>
      <div className='space-y-4'>
        <div className='flex space-x-2'>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='User email'
            className='flex-1'
            type='email'
          />
          <Select
            value={permission}
            onChange={(e) => setPermission(e.target.value as 'view' | 'edit')}
            options={[
              { value: 'view', label: 'View' },
              { value: 'edit', label: 'Edit' },
            ]}
          />
          <Button onClick={handleAddShare}>Add</Button>
        </div>
        <div className='space-y-2'>
          {sharedWith.map((user) => (
            <div
              key={user.userId}
              className='flex justify-between items-center'
            >
              <span>{user.email}</span>
              <div className='flex items-center space-x-2'>
                <span className='text-sm text-gray-500'>{user.permission}</span>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => handleRemoveShare(user.userId)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className='flex justify-end'>
          <Button onClick={onClose}>Done</Button>
        </div>
      </div>
    </Modal>
  );
};
