// Hook for grouping state relating to memo together to be used across screens. Implemented with useImmerReducer to prevent complicated array manipulation
import { useState } from 'react';

type MemoType = {
  memoPosition: { x: string; y: string };
  spinnerPosition: { x: string; y: string };
  memoVisibility: string;
  memoValue: string;
  memoId: string;
};

type MemoUpdateFunction = {
  updatePosition: (x: number, y: number, innerY: number) => void;
  updateVisibility: (newVisibility: string) => void;
  updateValue: (newValue: string) => void;
  updateId: (id: string) => void;
};

const useNote = (): [MemoType, MemoUpdateFunction] => {
  const [memos, setMemos] = useState<MemoType>({
    memoPosition: { x: '0px', y: '0px' },
    spinnerPosition: { x: '0px', y: '0px' },
    memoVisibility: 'hidden',
    memoValue: '',
    memoId: 'initial',
  });

  // update function for memo state
  const updateMemoState: MemoUpdateFunction = {
    updatePosition: (x, y, innerY) => {
      setMemos((memos) => ({
        ...memos,
        memoPosition: { x: x + 'px', y: y + 'px' },
        spinnerPosition: { x: x - 60 + 'px', y: innerY + 10 + 'px' },
      }));
    },
    updateVisibility: (newVisibility) => {
      setMemos((memos) => ({
        ...memos,
        memoVisibility: newVisibility,
      }));
    },
    updateValue: (newValue) => {
      setMemos((memos) => ({
        ...memos,
        memoValue: newValue,
      }));
    },
    updateId: (id) => {
      setMemos((memos) => ({
        ...memos,
        memoId: id,
      }));
    },
  };

  return [memos, updateMemoState];
};

export default useNote;
