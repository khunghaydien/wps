import React from 'react';

import { Spinner as SLDSSpinner } from '@salesforce/design-system-react';
import styled, { css, FlattenSimpleInterpolation } from 'styled-components';

interface Props {
  'aria-label'?: string;
  'data-testid'?: string;
  className?: string;
  assistiveText?: string;
  size?: 'x-small' | 'small' | 'medium' | 'large';
  variant?: 'base' | 'inverse';
}

const Size = {
  'x-small': css`
    width: 24px;
    height: 28px;
  `,
  small: css`
    width: 32px;
    height: 36px;
  `,
  medium: css`
    width: 48px;
    height: 56px;
  `,
  large: css`
    width: 60px;
    height: 68px;
  `,
};

const S = {
  Container: styled.div<{ size?: keyof typeof Size }>`
    position: relative;
    display: inline-block;
    background: transparent;
    ${({ size = 'small' }): FlattenSimpleInterpolation => Size[size]};
  `,
  // Ensure overriding styles defined in Salesforce Platform
  Spinner: styled.div`
    background: transparent !important;
  `,
};

const WrappedSpinner: React.FC<{ className?: string }> = React.memo(
  ({ className, ...props }) => {
    return <SLDSSpinner {...props} containerClassName={className} />;
  }
);

const Spinner: React.FC<Props> = ({
  'data-testid': testid,
  className,
  ...props
}: Props) => {
  return (
    <S.Container data-testid={testid} className={className} size={props.size}>
      <S.Spinner as={WrappedSpinner} {...props} className={className} />
    </S.Container>
  );
};

export default Spinner;
