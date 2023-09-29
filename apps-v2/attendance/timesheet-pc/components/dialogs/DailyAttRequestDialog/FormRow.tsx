import * as React from 'react';

import classNames from 'classnames';

import ObjectUtil from '../../../../../commons/utils/ObjectUtil';

import './FormRow.scss';

const ROOT = 'timesheet-pc-dialogs-daily-att-request-dialog-form-row';

type Props = Readonly<{
  labelText: string;
  children: React.ReactNode;
  className?: string;
  height?: 'thin' | null;
}>;

const FormRow = (props: Props) => {
  const childProps = React.useMemo(() => {
    if (props.children === null) {
      return {};
    } else if (Array.isArray(props.children)) {
      const node =
        props.children.find(
          (n: React.ReactElement) => n && n.props && n.props.required
        ) || {};
      return ObjectUtil.getOrDefault(node, 'props', {});
    } else if (typeof props.children === 'object') {
      return ObjectUtil.getOrDefault(props.children, 'props', {});
    } else {
      return {};
    }
  }, [props.children]);

  return (
    <div className={classNames(ROOT, props.className)}>
      <div
        className={classNames(`${ROOT}__label`, {
          [`${ROOT}__label--height-thin`]: props.height === 'thin',
        })}
      >
        <p>
          {childProps.required && <span>*</span>}
          {props.labelText}
        </p>
      </div>
      <div className={`${ROOT}__body`}>{props.children}</div>
    </div>
  );
};

export default FormRow;
