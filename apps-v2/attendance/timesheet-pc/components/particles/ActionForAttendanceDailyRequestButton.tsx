import * as React from 'react';

import msg from '@apps/commons/languages';
import Button from '@apps/core/elements/Button';

import {
  ACTIONS_FOR_FIX,
  ActionsForFix,
} from '@attendance/domain/models/AttFixSummaryRequest';

import actionLabel from '@attendance/ui/helpers/fixDailyRequest/actionLabel';

export const LOCATION = {
  DISPLAY_FIELD: 'displayField',
} as const;

type Location = Value<typeof LOCATION>;

type ButtonProps = React.ComponentProps<typeof Button>;

const useProps = (type: ActionsForFix, location?: Location) =>
  React.useMemo<{
    text: string;
    color: ButtonProps['color'];
  } | void>(() => {
    switch (type) {
      case ACTIONS_FOR_FIX.Submit:
        return {
          color: 'primary',
          text:
            location && location === LOCATION.DISPLAY_FIELD
              ? msg().Att_Btn_SubmitFixRequest
              : actionLabel(type),
        };
      case ACTIONS_FOR_FIX.CancelRequest:
        return {
          color: 'danger',
          text: actionLabel(type),
        };
      case ACTIONS_FOR_FIX.CancelApproval:
        return {
          color: 'danger',
          text: actionLabel(type),
        };
    }
  }, [type, location]);

const ActionForAttendanceDailyRequestButton: React.FC<
  {
    type: ActionsForFix;
    location?: Location;
  } & Omit<ButtonProps, 'color' | 'type'>
> = ({ type, location, ...$props }) => {
  const props = useProps(type, location);
  if (!props) {
    return null;
  }
  return (
    <Button type="button" color={props.color} {...$props}>
      {props.text}
    </Button>
  );
};

export default ActionForAttendanceDailyRequestButton;
