import reducer, { Action, State } from '../personalSettingDialog';

describe('reducer', () => {
  describe('SHOW_PERSONAL_SETTING_DIALOG', () => {
    const prevState = {
      isVisible: false,
      newPersonalSetting: {},
    };
    const nextState = reducer(
      prevState as State,
      {
        type: 'SHOW_PERSONAL_SETTING_DIALOG',
        payload: {},
      } as Action
    );

    test('should set the visibility of the Personal Setting Dialog to truthy', () => {
      expect(nextState.isVisible).toBeTruthy();
    });
  });

  describe('HIDE_PERSONAL_SETTING_DIALOG', () => {
    const prevState = {
      isVisible: true,
      newPersonalSetting: {},
    };
    const nextState = reducer(prevState as State, {
      type: 'HIDE_PERSONAL_SETTING_DIALOG',
    });

    test('should set the visibility of the Personal Setting Dialog to falsy', () => {
      expect(nextState.isVisible).toBeFalsy();
    });
  });
});
