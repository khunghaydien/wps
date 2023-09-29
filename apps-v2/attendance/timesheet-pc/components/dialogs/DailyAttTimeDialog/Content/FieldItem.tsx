import * as React from 'react';

import styled from 'styled-components';

const FieldItemContainer = styled.div`
  display: flex;
  min-height: 40px;
  padding: 7px 42px;
  width: 100%;
  justify-content: center;
  align-items: start;
`;

const Label = styled.div`
  position: relative;
  width: 132px;
  // ラベルを行の真ん中ではなく上部に置くため。
  // 単純に上部に置くと line-height の違いでズレてしまうので padding でごまかしている。
  padding-top: 7px;
  padding-right: 14px;
  padding-left: 10px;
  color: #53688c;
  overflow-wrap: break-word;
  ::after {
    position: absolute;
    top: 7px;
    right: 5px;
    display: inline-block;
    content: ':';
  }
`;

const Content = styled.div`
  width: 324px;
`;

const FieldItem: React.FC<{
  className?: string;
  label: string;
  children: React.ReactNode;
}> = ({ className, label, children }) => (
  <FieldItemContainer className={className}>
    <Label className="label">{label}</Label>
    <Content className="content">{children}</Content>
  </FieldItemContainer>
);

FieldItem.defaultProps = {
  className: '',
};

export default FieldItem;
