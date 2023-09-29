import { OcrPdfDoc } from '@apps/domain/models/exp/OCR';

const ACTION_TYPES = {
  ADD: 'MODULES/EXP/UI/OCR_PDF_DOCS/ADD',
  REMOVE: 'MODULES/EXP/UI/OCR_PDF_DOCS/REMOVE',
  CLEAR: 'MODULES/EXP/UI/OCR_PDF_DOCS/CLEAR',
} as const;

type Add = {
  type: typeof ACTION_TYPES.ADD;
  payload: {
    [pdfContentDocId: string]: OcrPdfDoc;
  };
};
type Remove = {
  type: typeof ACTION_TYPES.REMOVE;
  payload: string;
};
type Clear = {
  type: typeof ACTION_TYPES.CLEAR;
};

export const actions = {
  add: (pdfDoc: OcrPdfDoc, pdfContentDocId: string): Add => ({
    type: ACTION_TYPES.ADD,
    payload: {
      [pdfContentDocId]: pdfDoc,
    },
  }),
  remove: (pdfContentDocId: string): Remove => ({
    type: ACTION_TYPES.REMOVE,
    payload: pdfContentDocId,
  }),
  clear: (): Clear => ({
    type: ACTION_TYPES.CLEAR,
  }),
};

type State = {
  [pdfContentDocId: string]: OcrPdfDoc;
};
const initialState: State = {};

export default (state = initialState, action: Add | Remove | Clear): State => {
  switch (action.type) {
    case ACTION_TYPES.ADD:
      return {
        ...state,
        ...action.payload,
      };
    case ACTION_TYPES.REMOVE:
      const removeStateCopy = { ...state };
      delete removeStateCopy[action.payload];
      return removeStateCopy;
    case ACTION_TYPES.CLEAR:
      return initialState;
    default:
      return state;
  }
};
