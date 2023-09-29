import * as React from 'react';

import classNames from 'classnames';

import TextUtil from '../../../commons/utils/TextUtil';

import './index.scss';

const ROOT = 'admin-pc-components-place-in-template';

type Props = {
  className?: string | null | undefined;
  template: string;
  children?: React.ReactNodeArray;
};

export default class PlaceInTemplate extends React.Component<Props> {
  render() {
    const { template, children, className } = this.props;
    return (
      <div className={className ? classNames(ROOT, className) : ROOT}>
        {TextUtil.parseText(template).map((token) => {
          const { value } = token;
          // @ts-ignore
          if (token.tag !== true) {
            return value;
          }
          if (children === undefined || children === null) {
            return '';
          }
          const index = Number(value) - 1;
          if (children instanceof Array) {
            if (index in children) {
              return children[index];
            }
          } else if (index === 0) {
            return children;
          }
          return '';
        })}
      </div>
    );
  }
}
