import * as React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';

const Container = styled.div`
  position: relative;
  display: grid;
  grid-template-rows: min-content auto;
  height: 100%;
`;

const Header = styled.div`
  height: 35px;
  padding-left: 65px;
  background-color: #b1c9db;
`;

const HeaderContainer = styled.div`
  color: #424e56;
  font-size: 15px;
  line-height: 35px;
`;

const Head = styled.div`
  overflow: hidden;
`;

const HeadContainer = styled.div`
  width: 100vw;
  min-width: 1024px;
`;

const AttDailyFixProcess: React.FC<{
  className?: string;
  FilterBar: React.FC;
  ToolBar: React.FC;
  Content: React.FC;
}> = ({ FilterBar, ToolBar, Content, className }) => (
  <Container className={className}>
    <Head>
      <HeadContainer>
        <Header>
          <HeaderContainer>{msg().Appr_Lbl_DailyFixRequest}</HeaderContainer>
        </Header>
        <ToolBar />
        <FilterBar />
      </HeadContainer>
    </Head>
    <Content />
  </Container>
);
AttDailyFixProcess.defaultProps = {
  className: '',
};

export default AttDailyFixProcess;
