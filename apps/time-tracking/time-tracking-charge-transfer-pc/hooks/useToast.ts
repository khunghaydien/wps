import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { actions as toast, Variant } from '../../../commons/modules/toast';

export type ShowToast = (message: string) => void;
export type HideToast = () => void;

export const useToast = (
  variant: Variant,
  duration?: number
): [ShowToast, HideToast] => {
  const dispatch = useDispatch();

  const hide = useCallback(() => {
    dispatch(toast.hide());
  }, [dispatch]);

  const show = useCallback(
    (message: string) => {
      dispatch(toast.show(message, variant));
      if (duration) {
        setTimeout(hide, duration);
      }
    },
    [dispatch, hide, variant, duration]
  );

  return [show, hide];
};
