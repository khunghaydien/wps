import snapshotDiff from 'snapshot-diff';

import reducer, {
  // @ts-ignore
  __get__,
  actions,
} from '../patternRequest';
import {
  patternDiscretionRequest,
  patternDiscretionWithoutTimeRequest,
  patternFixRequest,
  patternFlexRequest,
  patternFlexWithoutCoretimeRequest,
  patternManagerRequest,
  patternRequest,
} from './mock-data/patternRequest';

const initialState = __get__('initialState');
const INITIALIZE = __get__('INITIALIZE');
const SETWORKINGTYPE = __get__('SETWORKINGTYPE');
const SETDIRECTINPUT = __get__('SETDIRECTINPUT');
const UPDATE = __get__('UPDATE');
const UPDATE_HAS_RANGE = __get__('UPDATE_HAS_RANGE');

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(INITIALIZE, () => {
    // Arrange
    const prev = initialState;
    // Act
    const nextWorkingType = reducer(
      initialState,
      actions.setWorkingType(patternRequest.workingTypeInfo)
    );
    const nextDirectInpue = reducer(
      initialState,
      actions.setDirectInput(patternRequest.directInputInfo)
    );
    const next = reducer(
      initialState,
      actions.initialize(patternRequest.request, patternRequest.attPatternList)
    );
    const nextFix = reducer(
      initialState,
      actions.initialize(
        patternFixRequest.request,
        patternFixRequest.attPatternList
      )
    );
    const nextFlex = reducer(
      initialState,
      actions.initialize(
        patternFlexRequest.request,
        patternFlexRequest.attPatternList
      )
    );
    const nextFlexWithoutCoretime = reducer(
      initialState,
      actions.initialize(
        patternFlexWithoutCoretimeRequest.request,
        patternFlexWithoutCoretimeRequest.attPatternList
      )
    );
    const nextDiscretion = reducer(
      initialState,
      actions.initialize(
        patternDiscretionRequest.request,
        patternDiscretionRequest.attPatternList
      )
    );
    const nextDiscretionWithoutTime = reducer(
      initialState,
      actions.initialize(
        patternDiscretionWithoutTimeRequest.request,
        patternDiscretionWithoutTimeRequest.attPatternList
      )
    );
    const nextManager = reducer(
      initialState,
      actions.initialize(
        patternManagerRequest.request,
        patternManagerRequest.attPatternList
      )
    );
    // Assert
    expect(snapshotDiff(prev, nextWorkingType)).toMatchSnapshot();
    expect(snapshotDiff(prev, nextDirectInpue)).toMatchSnapshot();
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
    expect(snapshotDiff(prev, nextFix)).toMatchSnapshot();
    expect(snapshotDiff(prev, nextFlex)).toMatchSnapshot();
    expect(snapshotDiff(prev, nextFlexWithoutCoretime)).toMatchSnapshot();
    expect(snapshotDiff(prev, nextDiscretion)).toMatchSnapshot();
    expect(snapshotDiff(prev, nextDiscretionWithoutTime)).toMatchSnapshot();
    expect(snapshotDiff(prev, nextManager)).toMatchSnapshot();
  });
  test(SETWORKINGTYPE, () => {
    // Arrange
    const prev = initialState;
    // Act
    const nextWorkingType = reducer(
      initialState,
      actions.setWorkingType(patternRequest.workingTypeInfo)
    );
    // Assert
    expect(snapshotDiff(prev, nextWorkingType)).toMatchSnapshot();
  });
  test(SETDIRECTINPUT, () => {
    // Arrange
    const prev = initialState;
    // Act
    const nextDirectInput = reducer(
      initialState,
      actions.setDirectInput(patternRequest.directInputInfo)
    );
    // Assert
    expect(snapshotDiff(prev, nextDirectInput)).toMatchSnapshot();
  });
  test(UPDATE, () => {
    // Arrange
    const prev = patternRequest;
    const prevFix = patternFixRequest;
    const prevFlex = patternFlexRequest;
    const prevFlexWithoutCoretime = patternFlexWithoutCoretimeRequest;
    const prevDiscretion = patternDiscretionRequest;
    const prevDiscretionWithoutTime = patternDiscretionWithoutTimeRequest;
    const prevManager = patternManagerRequest;
    // Act
    const next = reducer(
      patternRequest,
      actions.update('reason', 'testですtestです。')
    );
    const nextWorkingType = reducer(
      patternRequest,
      actions.update('reason', 'testWorkingTypeですtestFixです。')
    );
    const nextFix = reducer(
      patternFixRequest,
      actions.update('reason', 'testFixですtestFixです。')
    );
    const nextFlex = reducer(
      patternFlexRequest,
      actions.update('reason', 'testFlexですtestFlexです。')
    );

    const nextFlexWithoutCoretime = reducer(
      patternFlexWithoutCoretimeRequest,
      actions.update(
        'reason',
        'testFlexWithoutCoretimeですtestFlexWithoutCoretimeです。'
      )
    );
    const nextDiscretion = reducer(
      patternDiscretionRequest,
      actions.update('reason', 'testDiscretionですtestDiscretionです。')
    );
    const nextDiscretionWithoutTime = reducer(
      patternDiscretionWithoutTimeRequest,
      actions.update(
        'reason',
        'testDiscretionWithoutTimeですtestDiscretionWithoutTimeです。'
      )
    );
    const nextManager = reducer(
      patternManagerRequest,
      actions.update('reason', 'testManagerですtestManagereです。')
    );
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
    expect(snapshotDiff(prev, nextWorkingType)).toMatchSnapshot();
    expect(snapshotDiff(prevFix, nextFix)).toMatchSnapshot();
    expect(snapshotDiff(prevFlex, nextFlex)).toMatchSnapshot();
    expect(
      snapshotDiff(prevFlexWithoutCoretime, nextFlexWithoutCoretime)
    ).toMatchSnapshot();
    expect(snapshotDiff(prevDiscretion, nextDiscretion)).toMatchSnapshot();
    expect(
      snapshotDiff(prevDiscretionWithoutTime, nextDiscretionWithoutTime)
    ).toMatchSnapshot();
    expect(snapshotDiff(prevManager, nextManager)).toMatchSnapshot();
  });
  test(UPDATE_HAS_RANGE, () => {
    // Arrange
    const prev = patternRequest;
    const prevFix = patternFixRequest;
    const prevFlex = patternFlexRequest;
    const prevFlexWithoutCoretime = patternFlexWithoutCoretimeRequest;
    const prevDiscretion = patternDiscretionRequest;
    const prevDiscretionWithoutTime = patternDiscretionWithoutTimeRequest;
    const prevManager = patternManagerRequest;
    // Act
    const next = reducer(patternRequest, actions.updateHasRange(true));
    const nextWorkingType = reducer(
      patternRequest,
      actions.updateHasRange(true)
    );
    const nextFix = reducer(patternFixRequest, actions.updateHasRange(true));
    const nextFlex = reducer(patternFlexRequest, actions.updateHasRange(true));
    const nextFlexWithoutCoretime = reducer(
      patternFlexWithoutCoretimeRequest,
      actions.updateHasRange(true)
    );
    const nextDiscretion = reducer(
      patternDiscretionRequest,
      actions.updateHasRange(true)
    );
    const nextDiscretionWithoutTime = reducer(
      patternDiscretionWithoutTimeRequest,
      actions.updateHasRange(true)
    );
    const nextManager = reducer(
      patternManagerRequest,
      actions.updateHasRange(true)
    );
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
    expect(snapshotDiff(prev, nextWorkingType)).toMatchSnapshot();
    expect(snapshotDiff(prevFix, nextFix)).toMatchSnapshot();
    expect(snapshotDiff(prevFlex, nextFlex)).toMatchSnapshot();
    expect(
      snapshotDiff(prevFlexWithoutCoretime, nextFlexWithoutCoretime)
    ).toMatchSnapshot();
    expect(snapshotDiff(prevDiscretion, nextDiscretion)).toMatchSnapshot();
    expect(
      snapshotDiff(prevDiscretionWithoutTime, nextDiscretionWithoutTime)
    ).toMatchSnapshot();
    expect(snapshotDiff(prevManager, nextManager)).toMatchSnapshot();
  });
});
