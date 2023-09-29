import React, { ChangeEvent, ReactElement, ReactNode, useState } from 'react';

import styled from 'styled-components';

import './index.scss';

interface ITabProps {
  id: string;
  actionButtons?: ReactElement;
  children: ReactNode;
  content?: ReactElement;
  isExpand?: boolean;
  isShowIcon?: boolean;
  label: string;
}

const AccordionTab = ({
  id,
  actionButtons,
  label,
  children,
  content,
  isExpand = true,
  isShowIcon = false,
}: ITabProps) => {
  const [isChecked, setIsChecked] = useState(isExpand);

  const onChangeCheckBox = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setIsChecked(checked);
  };

  return (
    <Wrapper className="accordion-tab" isChecked={isChecked}>
      <input
        type="checkbox"
        id={id}
        defaultChecked={isExpand}
        onChange={onChangeCheckBox}
        disabled={!isShowIcon}
      />
      <Label
        className="accordion-tab-label"
        htmlFor={id}
        isShowIcon={isShowIcon}
      >
        <div className="accordion-tab-label-content">
          {label}
          {actionButtons}
        </div>
      </Label>
      {content && (
        <div className="accordion-tab-visible-content">{content}</div>
      )}
      <div className="accordion-tab-content">{children}</div>
    </Wrapper>
  );
};

export default AccordionTab;

const Wrapper = styled.div<{ isChecked: boolean }>`
  overflow: ${({ isChecked }) => (isChecked ? 'visible' : 'hidden')};
`;

const Label = styled.label<{ isShowIcon: boolean }>`
  ${({ isShowIcon }) =>
    isShowIcon
      ? `::after {
    content: '\\2303';
    transform: scaleY(-1);
    filter: FlipV;
    text-align: center;
    transition: all 0.35s;
  }; cursor: pointer`
      : ''}
`;
