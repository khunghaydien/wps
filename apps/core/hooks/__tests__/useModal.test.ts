import React from 'react';

import { act, renderHook } from '@testing-library/react-hooks';

import useModal from '../useModal';

describe('useModal()', () => {
  it('should not open modal by default', () => {
    const { result } = renderHook(() => useModal());
    const { isOpen } = result.current;
    expect(isOpen).toBe(false);
  });

  it('should open modal by default', () => {
    const { result } = renderHook(() => useModal({ isOpen: true }));
    const { isOpen } = result.current;
    expect(isOpen).toBe(true);
  });

  it('should open modal', () => {
    // Arrange
    const { result } = renderHook(() => useModal());
    const { openModal } = result.current;

    // Act
    const event = {
      currentTarget: {},
    } as React.SyntheticEvent;
    act(() => {
      openModal(event);
    });

    // Assert
    const { isOpen } = result.current;
    expect(isOpen).toBe(true);
  });

  it('should close modal', () => {
    // Arrange
    const { result } = renderHook(() => useModal({ isOpen: true }));
    const { closeModal } = result.current;

    // Act
    act(() => {
      closeModal();
    });

    // Assert
    const { isOpen } = result.current;
    expect(isOpen).toBe(false);
  });

  it('should toggle open and closed state of modal', () => {
    // Arrange
    const { result } = renderHook(() => useModal({ isOpen: true }));
    const { toggleModal } = result.current;

    // Act
    const event = {
      currentTarget: {},
    } as React.SyntheticEvent;
    act(() => {
      toggleModal(event);
      toggleModal(event);
    });

    // Assert
    const { isOpen } = result.current;
    expect(isOpen).toBe(true);
  });

  it('should style the background of modal', () => {
    // Arrange
    const onOpen = jest.fn();

    // Act
    renderHook(() => useModal({ isOpen: true, onOpen }));

    // Arrange
    const { portal } = onOpen.mock.calls[0][0];
    expect(portal.current.style.cssText).toMatchSnapshot();
  });

  it('should remove the style of the background of modal', () => {
    // Arrange
    const onClose = jest.fn();
    const { result } = renderHook(() => useModal({ isOpen: true, onClose }));
    const { closeModal } = result.current;

    // Act
    act(() => {
      closeModal();
    });

    // Arrange
    const { portal } = onClose.mock.calls[0][0];
    expect(portal.current.style.cssText).toBe('');
  });
});
