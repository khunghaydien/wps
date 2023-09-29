import React, { useEffect } from 'react';

import isNil from 'lodash/isNil';
import { $Values } from 'utility-types';

import styled, { keyframes } from 'styled-components';

import { Color } from '@apps/core/styles';

import IconButton from '../../atoms/IconButton';
import Modal from '../../atoms/Modal';

export const textColor = { primary: 'primary', error: 'error' } as const;

export type TextColor = $Values<typeof textColor>;

const theme = {
  primary: 'inherit',
  error: Color.error,
  disable: Color.disable,
  bgTitle: '#f0f7fa',
  bgItem: Color.base,
  border: Color.border3,
};

type MenuItem = {
  label: string | React.ReactNode;
  action?: () => void;
  disabled?: boolean;
  color?: TextColor;
};

type Props = {
  closeModal: () => void;
  title: string;
  menuItems: Array<MenuItem>;
};

const MoveUp = keyframes`
from {
  transform: translate3d(0, 100%, 0);
}
to {
  transform: translate3d(0, 0, 0);
}
`;

const S = {
  OuterDiv: styled(Modal)`
    display: flex;
    flex-direction: column-reverse;
    align-items: center;

    .content {
      width: 100vw;
      padding: 0 !important;
      text-align: center;
    }

    .close-button {
      display: none;
    }
  `,
  Animation: styled.div`
    animation: ${MoveUp} 0.2s ease-in-out;
  `,
  Title: styled.div`
    min-height: 42px;
    display: flex;
    align-items: center;
    background: ${theme.bgTitle};
    border-radius: 8px 8px 0 0;
    font-weight: bold;
    justify-content: center;
    border-bottom: 1px solid ${theme.border};
  `,
  Item: styled.div<{ disabled?: boolean; color?: TextColor }>`
    min-height: 42px;
    display: flex;
    align-items: center;
    background: ${theme.bgItem};
    padding-left: 20px;
    color: ${({ disabled, color = 'primary' }) =>
      disabled ? theme.disable : theme[color]};
    :not(:last-child) {
      border-bottom: 1px solid ${theme.border};
    }
  `,
  IconButton: styled(IconButton)`
    position: absolute;
    right: 14px;
    width: 12px;
    align-items: center !important;
  `,
};

const ROOT = 'mobile-app-organisms-expense-footer-options-modal';

export const FOOTER_MODAL = 'footer';

const FooterOptionsModal = (props: Props) => {
  const { closeModal, menuItems } = props;

  useEffect(() => {
    document
      .getElementsByClassName(ROOT)[0]
      .addEventListener('click', (e: any) => {
        if (!isNil(e.target.getAttribute('disabled'))) {
          e.stopPropagation();
        }
        const isOverlayElement =
          e.target.classList.contains(`${ROOT}__item`) ||
          e.target.tagName.toLowerCase() === 'label' ||
          e.target.tagName.toLowerCase() === 'input' ||
          e.target.classList.contains(`${ROOT}__title`);
        if (!isOverlayElement) {
          closeModal();
        }
      });
  }, []);

  const renderItem = (item) => (
    <S.Item
      onClick={item.action}
      className={`${ROOT}__item`}
      disabled={item.disabled}
      color={item.color}
    >
      {item.label}
    </S.Item>
  );
  return (
    <S.OuterDiv
      persistent={false}
      className={ROOT}
      onClickCloseButton={closeModal}
    >
      <S.Animation>
        <S.Title className={`${ROOT}__title`}>
          {props.title}
          <S.IconButton icon="close-copy" onClick={closeModal} />
        </S.Title>
        {menuItems.map((item) => renderItem(item))}
      </S.Animation>
    </S.OuterDiv>
  );
};

export default FooterOptionsModal;
