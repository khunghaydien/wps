import * as React from 'react';

import DialogRoot from '../blocks/Dialog/DialogRoot';
import DialogContext, { DialogType, DialogTypeProps } from './DialogContext';

type Props = {
  children: React.ReactNode;
};

const DialogProvider = ({ children }: Props) => {
  const [dialogs, setDialogs] = React.useState({});
  const showDialog = React.useCallback(
    (key: string, dialog: DialogType, props: DialogTypeProps) => {
      setDialogs((ds) => ({
        ...ds,
        [key]: { dialog, props },
      }));
    },
    []
  );
  const hideDialog = React.useCallback((key: string) => {
    setDialogs((ds) => {
      if (ds[key]) {
        const newDialogs = { ...ds };
        delete newDialogs[key];
        return newDialogs;
      } else {
        return ds;
      }
    });
  }, []);

  return (
    <DialogContext.Provider
      value={{
        showDialog,
        hideDialog,
      }}
    >
      <>
        {children}
        <DialogRoot dialogs={dialogs} />
      </>
    </DialogContext.Provider>
  );
};

/**
 * A Provide for modal or modeless dialogs.
 *
 * @example
 * // A sample of Dialog component
 * const JobSelectDialog = <Dialog
 *   modal
 *   id='unique-key' // must be unique since it is used for identifying a dialog.
 *   content={...}
 *   footer={...}
 * />;
 *
 * // Wrap DialogProvider around app root
 * <DialogProvider>
 *  <App/>
 * </DialogProvider>
 *
 * // The client code can show or hide a dialog using useDialog API.
 * const [ showJobDialog, hideJobDialog ] = useDialog(JobSelectDialog); // Specify a dialog you want
 * return <div><button onClick={showDialog} /></div>;
 */
export default React.memo<Props>(DialogProvider);
