import * as React from 'react';

import isNil from 'lodash/isNil';

import { Tooltip as PopoverTooltip } from '@salesforce/design-system-react';

const ROOT = 'commons-tooltip';

export type Props = {
  id?: string;
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
  position?: 'absolute' | 'relative' | 'overflowBoundaryElement';
  content: string | React.ReactNode;
  children: string | React.ReactElement<any>;
  className?: string;
  style?: Record<string, any>;
  contentStyle?: Record<string, any>; // eslint-disable-line react/no-unused-prop-types
  hasStaticAlignment?: boolean;
};

const compose = (...fns: Function[]): Function =>
  fns.reduce(
    (f: Function, g: Function) => (x) => f(g(x)),
    (x) => x
  );

const asElement = (children: string | React.ReactElement<any>) =>
  typeof children === 'string' ? (
    <div tabIndex={0} style={{ display: 'inline' }}>
      {children}
    </div>
  ) : (
    children
  );

const withStyledChildren =
  (contentStyle?: Record<string, any>) =>
  (WrappedElement: React.ReactElement<any>): React.ReactElement<any> => {
    const { style, ...props } = WrappedElement.props;
    return React.cloneElement(WrappedElement, {
      ...props,
      style: { ...style, ...contentStyle },
    });
  };

const withTriggerableChildren = (
  WrappedElement: React.ReactElement<any>
): React.ReactElement<any> => {
  const { tabIndex, ...props } = WrappedElement.props;
  const triggerableElement = ['a', 'button', 'input', 'select', 'textarea'];
  const isTriggerable =
    triggerableElement.includes(WrappedElement.type as string) ||
    (!isNil(tabIndex) && tabIndex >= 0);
  return React.cloneElement(WrappedElement, {
    ...props,
    tabIndex: isTriggerable ? tabIndex : 0,
  });
};

const withTriggerable =
  (WrappedComponent: React.ComponentType<Props>): React.ComponentType<any> =>
  ({ children, contentStyle, ...props }: Props) => {
    const wrappedChildren: React.ReactElement<any> = compose(
      withStyledChildren(contentStyle),
      withTriggerableChildren,
      asElement
    )(children);

    return (
      <WrappedComponent {...props} contentStyle={contentStyle}>
        {wrappedChildren}
      </WrappedComponent>
    );
  };

const TooltipPresnetation = ({
  id,
  align = 'top',
  position = 'overflowBoundaryElement',
  content,
  children,
  style,
  className = '',
  hasStaticAlignment = true,
}: Props) => (
  <div id={ROOT} className={`${ROOT} ${className}`} style={style}>
    <PopoverTooltip
      id={id}
      align={align}
      position={position}
      content={content} //  hasStaticAlignment is not fully tested by salesforce
      hasStaticAlignment={hasStaticAlignment}
      triggerStyle={{ display: 'block' }}
    >
      {children}
    </PopoverTooltip>
  </div>
);

const Component = compose(withTriggerable)(TooltipPresnetation);
Component.displayName = 'Tooltip';

export default Component;
