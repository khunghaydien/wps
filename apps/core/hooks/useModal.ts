import * as React from 'react';
import usePortal from 'react-useportal';

export const DEFAULT_Z_INDEX = 5100000;

/**
 * Custom event of react-useportal
 */
type PortalEvent<T> = {
  /**
   * Synthetic Event
   */
  event?: React.SyntheticEvent<T>;

  /**
   * Ref of portal element
   */
  portal: { current: HTMLElement };

  /**
   * Ref of target element on which openPortal is fired
   */
  targetEl: { current: Element };
};

interface Modal {
  /**
   * Modal component
   */
  Modal: React.ComponentType<{ children: React.ReactNode }>;

  /**
   * Open and closed state
   */
  isOpen: boolean;

  /**
   * Open modal
   */
  openModal: (arg0: React.SyntheticEvent<any>) => void;

  /**
   * Close modal
   */
  closeModal: () => void;

  /**
   * Toggle modal
   */
  toggleModal: (arg0: React.SyntheticEvent<any>) => void;
}

type Option = {
  /**
   * This will be the default for the modal. Default is false.
   */
  isOpen?: boolean;

  /**
   * This will be called on opening the modal.
   */
  onOpen?: (arg0: PortalEvent<any>) => void;

  /**
   * This will be called on closing the modal.
   */
  onClose?: (arg0: PortalEvent<any>) => void;

  /**
   * z-index is for modal.
   * Default value is 5100000.
   */
  zIndex?: number;
};

/**
 * Open a modal
 *
 * @param {Option} option
 *
 * @example
 * const YourCoolModal = () => {
 *   const { isOpen, openModal, closeModal, Modal } = useModal();
 *   return (
 *     <button onClick={openModal}>Open Modal</button>
 *     {isOpen && (
 *       <Modal>
 *         <button onClick={closeModal}>Close Modal</button>
 *         <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis congue quam.</p>
 *       </Modal>
 *     )}
 *   );
 * }
 */
const useModal = ({
  isOpen: isOpenByDefault = false,
  onOpen,
  onClose,
  zIndex = DEFAULT_Z_INDEX,
}: Option = {}): Modal => {
  const { isOpen, openPortal, togglePortal, closePortal, Portal } = usePortal({
    isOpen: isOpenByDefault,
    closeOnOutsideClick: false,
    closeOnEsc: false,
    onOpen({ portal, ...event }: PortalEvent<any>) {
      // Style modal background at the root element of portal
      portal.current.style.cssText = `
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;

        /* Background */
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: ${zIndex};
      `;

      if (onOpen) {
        onOpen({ portal, ...event });
      }
    },
    onClose(event: PortalEvent<any>) {
      const { portal } = event;
      portal.current.removeAttribute('style');

      if (onClose) {
        onClose({ ...event });
      }
    },
  });

  // WORKAROUND
  // isOpen is stored via React.useState and its initial value is set statically.
  // So if isOpenByDefault is given dynamically, i.e. getting over network etc.,
  // false as initial value will be set. This behavior means that
  // it always starts from closed state.
  // To avoid this, here, it forces to open by calling openModal manually
  // when isOpenByDefault changed once.
  React.useEffect(() => {
    if (isOpenByDefault) {
      const fakeEvent = {
        /*
         * NOTE:
         * This element is used for functionality of closing the modal when clicked outside of the modal in usePortal internal code.
         * But this functionality is not used, so there is no problem just creating a temporary element and use it.
         * Ideally, we should use the `ref` returned from usePortal when calling openPortal not via event handler.
         */
        currentTarget: document.createElement('div'),
      };
      openPortal(fakeEvent);
    } else {
      closePortal();
    }
  }, [isOpenByDefault]);

  return {
    Modal: Portal,
    openModal: openPortal,
    toggleModal: togglePortal,
    closeModal: closePortal,
    isOpen,
  };
};

export default useModal;
