import * as React from 'react';

import nanoid from 'nanoid';

import DialogContext, { DialogType } from '../../contexts/DialogContext';

type ShowDialog = () => void;
type HideDialog = () => void;

const useDialog = (
  component: DialogType,
  isModal: boolean,
  inputs: any[]
): [ShowDialog, HideDialog] => {
  const [isOpening, setIsOpening] = React.useState(false);
  const show = React.useCallback(() => setIsOpening(true), []);
  const hide = React.useCallback(() => setIsOpening(false), []);

  const key = React.useMemo(() => nanoid(8), []);
  const dialog = React.useMemo(() => component, inputs);
  const context = React.useContext(DialogContext);

  React.useEffect(() => {
    if (isOpening) {
      context.showDialog(key, dialog, { isModal, onClose: hide });
    } else {
      context.hideDialog(key);
    }

    return () => context.hideDialog(key);
  }, [dialog, isOpening]);

  return [show, hide];
};

/**
 * React hook for showing modal dialog
 *
 * @param component - Dialog component
 * @param [isOpen=false] - initial open state
 * @returns {[ShowDialog, HideDialog]}
 */
export const useModal = (
  component: DialogType,
  inputs: any[]
): [ShowDialog, HideDialog] => useDialog(component, true, inputs);

/**
 * React hook for showing modeless dialog
 *
 * @param component - Dialog component
 * @param [isOpen=false] - initial open state
 * @returns {[ShowDialog, HideDialog]}
 */
export const useModeless = (
  component: DialogType,
  inputs: any[]
): [ShowDialog, HideDialog] => useDialog(component, false, inputs);
