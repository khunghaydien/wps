import React from 'react';

import InfoIcon from '../../../images/icons/info.svg';
import Tooltip from '../../Tooltip';

import './index.scss';

const ROOT = 'ts-psa__legend';

type toolTipItem = {
  text: string;
  color: string;
};

type toolTipGroup = {
  toolTipTitle?: string;
  toolTipItemList?: Array<toolTipItem>;
};

type Props = {
  align?: string;
  testId?: string;
  toolTipGroupList?: Array<toolTipGroup>;
};

/**
 * Legend title can be passed from parent component
 * Legend item text and color can be further optimized
 * Currently it only supports 3 colors
 */
const Legend = ({ toolTipGroupList = [], align = 'right', testId }: Props) => {
  const customToolTipContent =
    toolTipGroupList &&
    toolTipGroupList.map((toolTipGroup, index) => (
      <div className={`${ROOT}__toolTip-content`}>
        <div className={`${ROOT}__toolTip-header`}>
          {toolTipGroup.toolTipTitle}
        </div>
        <div className={`${ROOT}__toolTip-body`}>
          {toolTipGroup.toolTipItemList &&
            toolTipGroup.toolTipItemList.map((item) => (
              <div className={`${ROOT}__toolTip-item`}>
                <span className={`${ROOT}__toolTip-item-color ${item.color}`} />
                {item.text}
              </div>
            ))}
        </div>
        {index !== toolTipGroupList.length - 1 && (
          <hr className={`${ROOT}__divider`} />
        )}
      </div>
    ));

  return (
    <div className={`${ROOT}`} data-testid={testId}>
      <div className={`${ROOT}__label`}>
        <Tooltip id={testId} align={align} content={customToolTipContent}>
          <InfoIcon />
        </Tooltip>
      </div>
    </div>
  );
};

export default Legend;
