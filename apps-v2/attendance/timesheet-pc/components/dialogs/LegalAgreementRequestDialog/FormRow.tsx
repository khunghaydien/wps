import React, { useMemo } from 'react';

import styled from 'styled-components';

import ObjectUtil from '@apps/commons/utils/ObjectUtil';

const S = {
  Wrapper: styled.div`
    display: flex;
    &:not(:nth-of-type(1)) {
      margin-top: 20px;
    }
  `,
  Label: styled.div`
    display: flex;
    position: relative;
    align-items: flex-start;
    width: 106px;
    span {
      position: absolute;
      left: -8px;
      font-size: 13px;
      color: #f00;
    }
    p {
      font-size: 13px;
      color: #666;
    }
  `,
  LabelText: styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    overflow-wrap: anywhere;
    width: 106px;
  `,
  Body: styled.div`
    width: 100%;
    margin-left: 20px;
    font-size: 13px;
    color: #333;
  `,
};

type Props = Readonly<{
  labelText: string;
  children: React.ReactNode;
}>;

const FormRow: React.FC<Props> = ({ labelText, children }) => {
  const childProps = useMemo(() => {
    if (children === null) {
      return {};
    } else if (Array.isArray(children)) {
      const node =
        children.find(
          (n: React.ReactElement) => n && n.props && n.props.required
        ) || {};
      return ObjectUtil.getOrDefault(node, 'props', {});
    } else if (typeof children === 'object') {
      return ObjectUtil.getOrDefault(children, 'props', {});
    } else {
      return {};
    }
  }, [children]);
  return (
    <S.Wrapper>
      <S.Label>
        <p>
          {childProps.required && <span>*</span>}
          <S.LabelText title={labelText}>{labelText}</S.LabelText>
        </p>
      </S.Label>
      <S.Body>{children}</S.Body>
    </S.Wrapper>
  );
};

export default FormRow;
