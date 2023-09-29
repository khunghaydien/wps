import React from 'react';

import _ from 'lodash';

import ImgIconAttention from '../../../../../images/icons/attention.svg';
import Tooltip from '../../../../Tooltip';

import './index.scss';

type Props = {
  idx: number;
  align?: string;
  className: string;
  errors?: Record<string, unknown>;
  tooltip?: string;
  touched?: Record<string, unknown>;
};

export default class RecordsIcon extends React.Component<Props> {
  findPairTouched = (
    errors: any,
    touched: Record<string, unknown>,
    path: string
  ) => {
    let find = false;
    /* eslint-disable @typescript-eslint/no-this-alias */
    const self = this;
    _.forEach(errors, (error, key) => {
      if (typeof error === 'object') {
        const ret = self.findPairTouched(error, touched, `${path}${key}.`);
        if (ret) {
          find = true;
          return false;
        }
      }
      if (_.get(touched, `${path}${key}`)) {
        find = true;
        return false;
      }
      return true;
    });
    return find;
  };

  render() {
    const { align = 'top left', errors, idx, tooltip } = this.props;
    const ROOT = this.props.className;
    const recordErrors = _.get(errors, `records.${idx}`);
    const recordExpTypeError = _.get(
      errors,
      `records.${idx}.items[0].expTypeId`
    );
    const recordItemsNumberError = _.get(errors, `records.${idx}.items`);

    let iconClassName = `${ROOT}__hidden`;
    if (recordErrors || recordExpTypeError || recordItemsNumberError) {
      iconClassName = `${ROOT}__appear`;
    }

    const errorIconImg = <ImgIconAttention className={iconClassName} />;

    const toolTipStyle = { display: 'inline-block' };

    return (
      <div className={`${ROOT}`}>
        {tooltip ? (
          <Tooltip
            id={ROOT}
            align={align}
            content={<div className={`${ROOT}__tooltipMsg`}>{tooltip}</div>}
            style={toolTipStyle}
          >
            {errorIconImg}
          </Tooltip>
        ) : (
          <> {errorIconImg} </>
        )}
      </div>
    );
  }
}
