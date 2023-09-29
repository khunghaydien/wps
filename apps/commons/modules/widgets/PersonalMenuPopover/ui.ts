import UrlUtil from '../../../utils/UrlUtil';

const HIDE = Symbol('COMMONS/MODULES/WIDGETS/PERSONAL_MENU_POPOVER/UI/HIDE');
const SHOW = Symbol('COMMONS/MODULES/WIDGETS/PERSONAL_MENU_POPOVER/UI/SHOW');
const TOGGLE = Symbol(
  'COMMONS/MODULES/WIDGETS/PERSONAL_MENU_POPOVER/UI/TOGGLE'
);

export const constants = { SHOW, HIDE, TOGGLE };

/**
 * Create an event to show the popover
 */
const show = () => ({
  type: SHOW,
});

/**
 * Create an event to hide the popover
 */
const hide = () => ({
  type: HIDE,
});

/**
 * Create an event to toggle the popover
 */
const toggle = () => ({
  type: TOGGLE,
});

const openLeaveWindow = () => () => {
  UrlUtil.openApp('timesheet-pc-leave', {});
};

export const actions = { show, hide, toggle, openLeaveWindow };

const initialState = {
  visible: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SHOW:
      return {
        ...state,
        visible: true,
      };
    case HIDE:
      return {
        ...state,
        visible: false,
      };
    case TOGGLE:
      return {
        ...state,
        visible: !state.visible,
      };

    default:
      return state;
  }
};
