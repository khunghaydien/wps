import * as React from 'react';

import styled from 'styled-components';

type Props = {
  readonly projectName: string;
};

const S = {
  Title: styled.header`
    width: 100%;
    height: 100%;
    padding-top: 12px;
  `,
  TitleBody: styled.div`
    width: 462px;
    height: 36px;
    margin-left: 12px;
    border-radius: 4px;
    border: 0;
    font-size: 20px;
    line-height: 30px;
    padding: 2px 8px 2px 8px;
  `,
};

const Header: React.ComponentType<Props> = React.memo(
  ({ projectName }: Props) => (
    <S.Title>
      <S.TitleBody>{projectName}</S.TitleBody>
    </S.Title>
  )
);

export default Header;
