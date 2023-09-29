import React from 'react';

import { $Values } from 'utility-types';

import CheckActive from '../images/icons/check-active.svg';
import CheckDisable from '../images/icons/check-disable.svg';
import CheckSelected from '../images/icons/check-selected.svg';

import './ProgressBar.scss';

const ROOT = 'ts-progress-bar';

export const PROGRESS_STATUS = {
  ACTIVE: 'active',
  SELECTED: 'selected',
  INACTIVE: 'inactive',
};

export type ProgressBarStep = {
  id: string;
  text: string;
  status: $Values<typeof PROGRESS_STATUS>;
};

export type ProgressBarProps = {
  steps: Array<ProgressBarStep>;
};

const CHECK_ICON = {
  selected: CheckSelected,
  active: CheckActive,
  inactive: CheckDisable,
  disable: CheckDisable,
};

const ProgressBar = ({ steps }: ProgressBarProps) => {
  return (
    <div>
      <ul className={ROOT}>
        {steps.map((step) => {
          const CheckIcon = CHECK_ICON[step.status];
          return (
            <>
              <li className={step.status}>
                <CheckIcon className={`${ROOT}-icon ${ROOT}-${step.status}`} />
                <div>{step.text}</div>
              </li>
            </>
          );
        })}
      </ul>
    </div>
  );
};

export default ProgressBar;
