import { TargetRecord } from './mock-data/fractionGrant';

import reducer, {
  // @ts-ignore
  __get__,
  actions,
  ActionType,
} from '../ui';

const initialState = __get__('initialState');

describe('admin-pc/fractionGrant/ui', () => {
  describe('action', () => {
    describe('setShowDialog', () => {
      test('should return action', () => {
        expect(actions.setShowDialog(true)).toEqual({
          type: ActionType.SET_SHOW_DIALOG,
          payload: true,
        });
      });
    });

    describe('setShowSuccessMessage', () => {
      test('should return action', () => {
        expect(actions.setShowSuccessMessage(true)).toEqual({
          type: ActionType.SET_SHOW_SUCCESS_MESSAGE,
          payload: true,
        });
      });
    });

    describe('setDetailEvent', () => {
      test('should return action', () => {
        expect(actions.setDetailEvent(TargetRecord)).toEqual({
          type: ActionType.SET_DETAIL_EVENT,
          payload: TargetRecord,
        });
      });
    });

    describe('setTempEvent', () => {
      test('should return action', () => {
        expect(actions.setTempEvent(TargetRecord)).toEqual({
          type: ActionType.SET_TEMP_EVENT,
          payload: TargetRecord,
        });
      });
    });

    describe('update', () => {
      test('should return action', () => {
        expect(actions.update('adjustmentType', 'RoundUpToOneDay')).toEqual({
          type: ActionType.UPDATE,
          payload: {
            key: 'adjustmentType',
            value: 'RoundUpToOneDay',
          },
        });
      });
    });
  });
  describe('reducer', () => {
    describe('SET_DETAIL_EVENT', () => {
      test('should update state', () => {
        expect(
          reducer(initialState, {
            type: ActionType.SET_DETAIL_EVENT,
            payload: TargetRecord,
          })
        ).toEqual({
          isShowFractionDialog: true,
          isShowSuccessMessage: false,
          detailEvent: TargetRecord,
          tempEvent: null,
          targetGrantHistoryRecordId: null,
        });
      });
    });
  });
});
