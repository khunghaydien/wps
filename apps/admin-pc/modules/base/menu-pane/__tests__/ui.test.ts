import reducer, {
  Action,
  CHANGE_COMPANY,
  initialState,
  SELECT_MENU_ITEM,
  State,
} from '../ui';

describe('admin-pc/modules/base/menu-pane/ui', () => {
  describe('reducer', () => {
    describe('CHANGE_COMPANY', () => {
      const action: Action = {
        type: CHANGE_COMPANY,
        payload: 'xxxx',
      };
      const state: State = initialState;
      const nextState: State = reducer(state, action);

      test('should update state', () => {
        expect(nextState.targetCompanyId).toBe('xxxx');
      });
    });

    describe('SELECT_MENU_ITEM', () => {
      const action: Action = {
        type: SELECT_MENU_ITEM,
        payload: 'Organization',
      };
      const state: State = initialState;
      const nextState: State = reducer(state, action);

      test('should update state', () => {
        expect(nextState.selectedMenuItemKey).toBe('Organization');
      });
    });
  });
});
