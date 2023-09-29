import React, { useState } from 'react';

import { IconSettings, Popover } from '@salesforce/design-system-react';

type Props = {
  align?:
    | 'top'
    | 'top left'
    | 'top right'
    | 'right'
    | 'right top'
    | 'right bottom'
    | 'bottom'
    | 'bottom left'
    | 'bottom right'
    | 'left'
    | 'left top'
    | 'left bottom';
  triggerAction?: string;
  ariaLabelledby?: string;
  heading?: string;
  children: React.ReactElement; //  Element who trigger popover
  style?: Record<string, any>; // styling applied to 'slds-popover'
  triggerClassName?: string; // class wrapped around triggering element
  body: React.ReactNode; // popover content
  hasStaticAlignment?: boolean; // if true, popover can extend/overflow parent
};

const TRIGGER_ACTIONS = {
  HOVER: 'hover',
  CLICK: 'click',
};
const ROOT = 'commons-popover-sf';

const SFPopover = (props: Props) => {
  const [isOpened, setIsOpened] = useState(false);
  const {
    children,
    triggerAction,
    align,
    body,
    ariaLabelledby = `${ROOT}-heading`,
    heading = '',
    style,
    triggerClassName,
    hasStaticAlignment,
  } = props;

  const popoverProps = {
    triggerAction,
    align,
    body,
    ariaLabelledby,
    heading,
    style,
    triggerClassName,
    hasStaticAlignment,
  };

  let withPopover;

  switch (triggerAction) {
    case TRIGGER_ACTIONS.HOVER:
      const childWithListener = React.cloneElement(children, {
        onMouseEnter: () => setIsOpened(true),
        onMouseLeave: () => setIsOpened(false),
      });
      withPopover = (
        <Popover isOpen={isOpened} {...popoverProps}>
          {childWithListener}
        </Popover>
      );
      break;

    case TRIGGER_ACTIONS.CLICK:
    default:
      withPopover = <Popover {...popoverProps}>{children}</Popover>;
      break;
  }

  return (
    <IconSettings iconPath={window.__icon_path__}>{withPopover}</IconSettings>
  );
};

export default SFPopover;
