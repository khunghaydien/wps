import React from 'react';
import DualListBox from 'react-dual-listbox';

import btnArrowDown from '@commons/images/btnArrowDown.png';
import btnArrowLeft from '@commons/images/btnArrowLeft.png';
import btnArrowRight from '@commons/images/btnArrowRight.png';
import btnArrowUp from '@commons/images/btnArrowUp.png';

import 'react-dual-listbox/lib/react-dual-listbox.css';
import './DualList.scss';

type Props = {
  headerLeft: string;
  headerRight: string;
  key: string;
  options: Array<Record<string, any>>;
  selected: Array<any>;
  disabled: boolean;
  onChange: (selected: string[]) => void;
  noAllowOrder?: boolean;
};

const ROOT = 'react-dual-listbox';

const DualList = (props: Props) => {
  return (
    <>
      <div className={`${ROOT}__dual_listbox_title`}>
        <span className={`${ROOT}__dual_listbox_title_left`}>
          {props.headerLeft}
        </span>
        <span>{props.headerRight}</span>
      </div>
      <DualListBox
        key={props.key}
        options={props.options}
        selected={props.selected}
        preserveSelectOrder
        showOrderButtons
        disabled={props.disabled}
        onChange={props.onChange}
        icons={{
          moveLeft: (
            <span className="fa fa-chevron-left">
              <img src={btnArrowLeft} alt="Left" />
            </span>
          ),
          moveRight: (
            <span className="fa fa-chevron-right">
              <img src={btnArrowRight} alt="Right" />
            </span>
          ),
          ...(!props.noAllowOrder
            ? {
                moveDown: (
                  <span className="fa fa-chevron-down">
                    <img src={btnArrowDown} alt="Down" />
                  </span>
                ),
                moveUp: (
                  <span className="fa fa-chevron-up">
                    <img src={btnArrowUp} alt="Up" />
                  </span>
                ),
              }
            : {}),
        }}
      />
    </>
  );
};

export default DualList;
