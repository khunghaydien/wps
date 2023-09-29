import * as React from 'react';

export type DialogTypeProps = {
  isModal: boolean;
  onClose: () => void;
};

/**
 * Represent dialog component
 */
export type DialogType = React.ComponentType<DialogTypeProps>;

/**
 * Throw error when DialogContext is used out of context provider.
 */
const invariantViolation = (..._args: any) => {
  throw new Error(
    'Attempt to call useDialog out of dialog context. Make sure your app is rendered in DialogProvider.'
  );
};

/**
 * Dialog context
 */
interface DialogContextType {
  showDialog: (key: string, dialog: DialogType, props: DialogTypeProps) => void;
  hideDialog: (key: string) => void;
}

const DialogContext = React.createContext<DialogContextType>({
  showDialog: invariantViolation,
  hideDialog: invariantViolation,
});

export default DialogContext;
