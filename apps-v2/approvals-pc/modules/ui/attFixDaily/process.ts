import ROOT from './actionType';

const ACTION_TYPE_ROOT = `${ROOT}/PROCESS` as const;

export const ACTION_TYPE = {
  SUCCESS: `${ACTION_TYPE_ROOT}/SUCCESS`,
} as const;
