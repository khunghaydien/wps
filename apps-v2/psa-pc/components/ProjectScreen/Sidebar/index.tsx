import React, { useState } from 'react';

import classNames from 'classnames';

import msg from '@apps/commons/languages';

import { PsaAccessType } from '@apps/domain/models/psa/PsaAccess';

import sidebarListData from './data';
import IconBurgerMenu from '@psa/images/icons/burgerMenu.svg';

import './index.scss';

export const ROOT = 'ts-psa__sidebar';

type Props = {
  accessSetting: PsaAccessType;
  activeTab: string;
  enableProjectFinance: boolean;
  switchTo: (component: string) => void;
};

const Sidebar = (props: Props) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebarMenu = () => setIsCollapsed(!isCollapsed);
  const sidebarClass = classNames(ROOT, {
    [`${ROOT}--collapsed`]: isCollapsed,
  });

  return (
    <div className={sidebarClass}>
      <div className={`${ROOT}__header`}>
        <div
          className={`${ROOT}__header-btn`}
          data-testid={`${ROOT}__header-btn`}
          onClick={toggleSidebarMenu}
        >
          <IconBurgerMenu
            className={`${ROOT}__header-btn-icon`}
            onClick={toggleSidebarMenu}
          />
        </div>
        <span className={`${ROOT}__text`}>{msg().Cal_Btn_Menu}</span>
      </div>
      <ul className={`${ROOT}__nav`}>
        {sidebarListData().map((i) => {
          const isActive = i.key === props.activeTab ? ' is-active' : '';

          // Don't show upload button if access permission for upload is false
          if (
            i.key === 'UPLOAD' &&
            !props.accessSetting.canUploadProjectRoles
          ) {
            return null;
          }

          if (i.key === 'FINANCE' && !props.enableProjectFinance) {
            return null;
          }

          return (
            <li
              key={i.key}
              className={`${ROOT}__list-items${isActive} ${ROOT}__list-item--${i.key}`}
              data-testId={`${ROOT}__list-item--${i.key}`}
              onClick={() => props.switchTo(i.key)}
            >
              {i.icon}
              <span className={`${ROOT}__text`}>{i.text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
