import reducer from '../jobSelectDialog';

describe('reducer', () => {
  describe('SHOW_JOB_SELECT_DIALOG', () => {
    test('should set the visibility of the Job Select Dialog to truthy', () => {
      const prevState = {
        isVisible: false,
      };
      const nextState = reducer(prevState, {
        type: 'SHOW_JOB_SELECT_DIALOG',
      });

      expect(nextState.isVisible).toBeTruthy();
    });
  });

  describe('HIDE_JOB_SELECT_DIALOG', () => {
    test('should set the visibility of the Job Select Dialog to falsy', () => {
      const prevState = {
        isVisible: true,
      };
      const nextState = reducer(prevState, {
        type: 'HIDE_JOB_SELECT_DIALOG',
      });

      expect(nextState.isVisible).toBeFalsy();
    });
  });
});
