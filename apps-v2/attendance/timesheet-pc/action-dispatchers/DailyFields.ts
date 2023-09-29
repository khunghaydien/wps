import { bindActionCreators } from 'redux';

import {
  DailyRecordDisplayFieldLayoutItem,
  LAYOUT_ITEM_TYPE,
  LayoutItemNumberValue,
} from '@attendance/domain/models/DailyRecordDisplayFieldLayout';
import {
  ACTIONS_FOR_FIX,
  FixDailyRequest,
} from '@attendance/domain/models/FixDailyRequest';

import {
  actions,
  DailyRecordDisplayFieldLayoutItemValueForUI,
  UpdateValue,
} from '@apps/attendance/timesheet-pc/modules/ui/dailyRecordDisplayFieldLayout';

import { AppDispatch } from './AppThunk';
import { IInputData as ISubmitFixRequestInputData } from '@attendance/domain/useCases/fixDailyRequest/ISubmitUseCase';
import Events from '@attendance/timesheet-pc/events';
import UseCases from '@attendance/timesheet-pc/UseCases';

interface DailyFieldsService {
  update: (param: UpdateValue) => void;
  save: (param: {
    recordId: string;
    row: DailyRecordDisplayFieldLayoutItem[];
    rowValues: {
      [itemId: string]: DailyRecordDisplayFieldLayoutItemValueForUI;
    };
  }) => Promise<void>;
  fixDaily: (
    record: ISubmitFixRequestInputData,
    changed: boolean,
    row: DailyRecordDisplayFieldLayoutItem[],
    rowValues: {
      [itemId: string]: DailyRecordDisplayFieldLayoutItemValueForUI;
    }
  ) => Promise<void>;
  cancelRequest: (fixDailyRequest: FixDailyRequest) => Promise<void>;
}

export default (dispatch: AppDispatch): DailyFieldsService => {
  const fieldsService = bindActionCreators(actions, dispatch);
  return {
    update: fieldsService.updateField,
    save: async (param) => {
      const { recordId, row, rowValues } = param;
      const values = convertToSavedValues(row, rowValues);

      await UseCases().saveFields({ recordId, values });
      Events.updatedDailyRecord.publish();
    },
    fixDaily: async (record, changed, row, rowValues) => {
      let submit = true;
      if (changed) {
        const values = convertToSavedValues(row, rowValues);
        submit = await UseCases()
          .saveFields({ recordId: record.id, values })
          .then(() => true)
          .catch(() => false);
      }

      if (submit) {
        await UseCases().submitFixDailyRequest(record);
      }
      Events.updatedDailyRecord.publish();
    },
    cancelRequest: async (fixDailyRequest) => {
      if (
        fixDailyRequest?.performableActionForFix ===
        ACTIONS_FOR_FIX.CancelRequest
      ) {
        await UseCases().cancelSubmittedFixDailyRequest(fixDailyRequest.id);
      } else if (
        fixDailyRequest?.performableActionForFix ===
        ACTIONS_FOR_FIX.CancelApproval
      ) {
        await UseCases().cancelApprovalFixDailyRequest(fixDailyRequest.id);
      }
      Events.updatedDailyRecord.publish();
    },
  };
};

const convertToSavedValues = (
  row: DailyRecordDisplayFieldLayoutItem[],
  rowValues: {
    [itemId: string]: DailyRecordDisplayFieldLayoutItemValueForUI;
  }
) => {
  return row
    .filter(
      (item) =>
        rowValues[item.id].existing === true &&
        rowValues[item.id].field?.editable
    )
    .map((item) => {
      const fieldValue = rowValues[item.id].value;
      let value = fieldValue.value as string;

      if (item.type === LAYOUT_ITEM_TYPE.NUMBER) {
        const { textValue } = fieldValue as LayoutItemNumberValue;
        value = textValue === '' ? null : textValue;
      }

      return {
        objectName: item.objectName,
        objectItemName: item.objectItemName,
        value,
      };
    });
};
