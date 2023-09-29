import React from 'react';

import styled from 'styled-components';

const ReportDetailSections = ({ children }) => <Tabs>{children}</Tabs>;

export default ReportDetailSections;

const Tabs = styled.div`
  overflow: hidden;
  color: #000;
`;
