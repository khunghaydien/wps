import * as React from 'react';

import styled from 'styled-components';

const Container = styled.div`
  display: grid;
  background-color: #f2f2f2;
  grid-template-rows: min-content auto min-content;
  height: 100%;
`;

const Top = styled.div``;
const Middle = styled.div`
  overflow-y: auto;
`;
const Bottom = styled.div`
  padding-top: 15px;
`;

const Detail: React.FC<{
  requestId: string;
  Header: React.FC;
  Content: React.FC;
  HistoryTable: React.FC;
  ApprovalForm: React.FC;
}> = ({ requestId, Header, Content, HistoryTable, ApprovalForm }) => {
  const scrollableEl = React.useRef(null);

  React.useEffect(() => {
    if (scrollableEl && scrollableEl.current) {
      scrollableEl.current.scrollTop = 0;
    }
  }, [requestId]);

  return (
    <Container>
      <Top>
        <Header />
      </Top>
      <Middle ref={scrollableEl}>
        <Content />
        <HistoryTable />
      </Middle>
      <Bottom>
        <ApprovalForm />
      </Bottom>
    </Container>
  );
};

export default Detail;
