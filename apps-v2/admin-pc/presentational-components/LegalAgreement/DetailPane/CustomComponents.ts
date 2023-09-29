import styled from 'styled-components';

import Button from '@apps/commons/components/buttons/Button';

import DataGrid from '@apps/admin-pc/components/DataGrid';

export const Grid = styled(DataGrid)`
  min-height: 105px;
  height: 105px !important;
  .react-grid-Container .react-grid-Main .react-grid-Grid {
    min-height: 105px !important;
  }

  .react-grid-HeaderCell {
    white-space: normal !important;
    height: 50px !important;
  }
  .react-grid-Header {
    height: 50px !important;
  }
  .react-grid-HeaderRow {
    height: 50px !important;
  }
  .react-grid-Viewport {
    inset: 50px 0px 0px !important;
  }
`;

export const EditButton = styled(Button)`
  padding: 0 16px !important;
`;
