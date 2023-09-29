import _ from 'lodash';

import { Report } from '../../../domain/models/exp/Report';

import { modes } from '../../modules/ui/expenses/mode';

export const needsResetForm = (
  mode: string,
  nextMode: string,
  selectedExpReport: Report,
  nextSelectedExpReport: Report,
  isFinanceApproval?: boolean
) => {
  if (isFinanceApproval) {
    return (
      selectedExpReport.reportId !== nextSelectedExpReport.reportId ||
      selectedExpReport.status !== nextSelectedExpReport.status ||
      (mode === modes.REPORT_EDIT &&
        nextMode === modes.REPORT_SELECT &&
        nextMode !== modes.FINANCE_REPORT_EDITED) ||
      (mode === modes.FINANCE_REPORT_EDITED &&
        nextMode !== modes.FINANCE_REPORT_EDITED)
    );
  } else {
    return (
      selectedExpReport.reportId !== nextSelectedExpReport.reportId ||
      selectedExpReport.status !== nextSelectedExpReport.status ||
      (mode === modes.REPORT_EDIT && nextMode !== modes.REPORT_EDIT) ||
      (mode === modes.REPORT_SELECT && nextMode === modes.INITIALIZE) ||
      (mode === modes.INITIALIZE && nextMode === modes.REPORT_SELECT)
    );
  }
};

export const mergeValues = (
  values: Record<string, unknown>,
  touched: Record<string, unknown>,
  updateObj: Record<string, any>
) => {
  const tmpValues = _.cloneDeep(values);
  const tmpTouched = _.cloneDeep(touched);

  Object.keys(updateObj as any).forEach((key) => {
    _.set(tmpValues, key, updateObj[key]);
    if (typeof updateObj[key] === 'object') {
      if (Array.isArray(updateObj[key]) && updateObj[key].length === 0) {
        _.set(tmpTouched, key, []);
      } else if (_.isEmpty(updateObj[key])) {
        _.set(tmpTouched, key, {});
      }
    } else {
      _.set(tmpTouched, key, true);
    }
  });
  return {
    values: tmpValues,
    touched: tmpTouched,
  };
};

export default needsResetForm;
