import { modes } from '../../../modules/ui/expenses/mode';

export const isReadOnly = (mode: string) => {
  if (mode === modes.REPORT_SELECT || mode === modes.REPORT_EDIT) {
    return false;
  }
  return true;
};

export const disableButton = (mode: string) => {
  return mode;
};
