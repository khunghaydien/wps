import * as React from 'react';

import ModalDialog from './ModalDialog';
import ModelessDialog from './ModelessDialog';

interface Props {
  'data-testid'?: string;
  isModal: boolean;
  title?: string;
  header?: React.ReactNode;
  content: React.ReactNode;
  footer?: React.ReactNode;
  onClose: (arg0: React.SyntheticEvent<HTMLElement>) => void;
}

const Dialog: React.FC<Props> = ({ isModal = false, ...props }: Props) => {
  const dialog = React.useMemo(
    () =>
      isModal ? <ModalDialog {...props} /> : <ModelessDialog {...props} />,
    [isModal, props]
  );
  return dialog;
};

export default Dialog as React.ComponentType<Props>;
export { useModal, useModeless } from './hooks';
