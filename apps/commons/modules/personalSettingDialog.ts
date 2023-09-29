import { PersonalSettingGroup } from '../constants/personalSettingGroup';

import { PersonalSetting } from '@apps/domain/models/PersonalSetting';

type PartialPersonalSetting = Pick<PersonalSetting, 'plannerDefaultView'>;

type ShowDialogAction = {
  type: 'SHOW_PERSONAL_SETTING_DIALOG';
  payload: PartialPersonalSetting;
};

/**
 * Creates an action to show the dialog of Personal Setting.
 * @return {ShowDialogAction}
 */
export const show = (
  originalPersonalSetting: PartialPersonalSetting
): ShowDialogAction => ({
  type: 'SHOW_PERSONAL_SETTING_DIALOG',
  payload: originalPersonalSetting,
});

type HideDialogAction = {
  type: 'HIDE_PERSONAL_SETTING_DIALOG';
};

/**
 * Creates an action to hide the dialog of Personal Setting.
 * @return {HideDialogAction}
 */
export const hide = (): HideDialogAction => ({
  type: 'HIDE_PERSONAL_SETTING_DIALOG',
});

type ChangeGroupAction = {
  type: 'CHANGE_PERSONAL_SETTING_GROUP';
  payload: {
    newGroup: PersonalSettingGroup;
    originalPersonalSetting: PartialPersonalSetting;
  };
};

/**
 * Creates an action to switch between the groups in dialog.
 */
export const changeGroup = (
  newGroup: PersonalSettingGroup,
  originalPersonalSetting: PartialPersonalSetting
): ChangeGroupAction => ({
  type: 'CHANGE_PERSONAL_SETTING_GROUP',
  payload: {
    newGroup,
    originalPersonalSetting,
  },
});

/**
 * Save the Personal Setting.
 * @see https://teamspiritdev.atlassian.net/wiki/spaces/GENIE/pages/518291840/personal-setting+save
 */
export type State = {
  isVisible: boolean;
  selectedGroup: PersonalSettingGroup;
  newPersonalSetting: PartialPersonalSetting;
};

const initialState: State = {
  isVisible: false,
  selectedGroup: 'TIME_TRACKING',
  newPersonalSetting: {
    plannerDefaultView: 'Weekly',
  },
};

export type Action = ShowDialogAction | HideDialogAction | ChangeGroupAction;
export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case 'SHOW_PERSONAL_SETTING_DIALOG':
      return {
        ...state,
        isVisible: true,
        newPersonalSetting: (action as ShowDialogAction).payload,
      };
    case 'HIDE_PERSONAL_SETTING_DIALOG':
      return initialState;
    case 'CHANGE_PERSONAL_SETTING_GROUP':
      const { newGroup, originalPersonalSetting } = (
        action as ChangeGroupAction
      ).payload;
      return {
        ...state,
        selectedGroup: newGroup,
        newPersonalSetting: originalPersonalSetting,
      };
    default:
      return state;
  }
};
