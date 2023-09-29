import snapshotDiff from 'snapshot-diff';

import {
  DISABLE_ACTION,
  EDIT_ACTION,
} from '@attendance/domain/models/LegalAgreementRequest';
import { CODE } from '@attendance/domain/models/LegalAgreementRequestType';

import reducer, {
  // @ts-ignore
  __get__,
  actions,
} from '../editing';
import request from './mocks/request';

const ACTION_TYPE = __get__('ACTION_TYPE');
const initialState = __get__('initialState');

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.INIT, () => {
    // Arrange
    const prev = initialState;
    // Act
    const next = reducer(initialState, actions.initialize(request, true));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.START, () => {
    // Arrange
    const prev = initialState;
    // Act
    const next = reducer(initialState, actions.startEditing());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.CLEAR, () => {
    // Arrange
    const prev = {
      id: 'a012v000033TVRXAA4',
      requestType: CODE.MONTHLY,
      isEditing: true,
      editAction: EDIT_ACTION.CREATE,
      disableAction: DISABLE_ACTION.CANCEL_APPROVAL,
    };
    // Act
    const next = reducer(prev, actions.clear());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
