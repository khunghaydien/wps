import { actions as warningActions } from '@apps/mobile-app/modules/attendance/attendanceRequest/warning';

import { AppDispatch } from '../../AppThunk';

export default (messages: string[] = []) =>
  (dispatch: AppDispatch): Promise<boolean> =>
    new Promise((resolve) => {
      dispatch(
        warningActions.setMessages(messages, (answer: boolean) => {
          dispatch(warningActions.clear());
          resolve(answer);
        })
      );
    });
