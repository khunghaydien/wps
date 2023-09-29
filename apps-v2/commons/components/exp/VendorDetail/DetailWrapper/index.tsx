import React from 'react';

import DraggableResizable from '../../../DraggableResizable';
import DetailPanel, { DRAG_HANDLE, PanelProps } from '../DetailPanel';

import './index.scss';

const ROOT = 'ts-expenses-vendor-detail-wrapper';

const LIMIT = {
  maxHeight: 600,
  maxWidth: 1200,
  minHeight: 100,
  minWidth: 200,
};

const DEFAULT_SIZE = {
  width: 600,
  height: 'auto',
};

export type Props = PanelProps & {
  isApproval?: boolean;
  useJctRegistrationNumber?: boolean;
};

const DetailWrapper = (props: Props) => {
  const { vendorId, isApproval } = props;

  let boundary = '.ts-expenses__form';
  boundary = isApproval ? '.approvals-pc-pane-wrapper' : boundary;

  // Roughly center in the screen when init
  let x = (window.innerWidth - Number(DEFAULT_SIZE.width)) / 2;
  x = isApproval ? -Number(DEFAULT_SIZE.width) / 2 : x;
  const y = Math.max(window.innerHeight / 2 - 400, 105);

  const initProperty = { ...DEFAULT_SIZE, x, y };

  const wrapper = (
    <div className={ROOT}>
      <DraggableResizable
        className={ROOT}
        bounds={boundary}
        maxHeight={LIMIT.maxHeight}
        maxWidth={LIMIT.maxWidth}
        minHeight={LIMIT.minHeight}
        minWidth={LIMIT.minWidth}
        default={initProperty}
        dragHandleClassName={DRAG_HANDLE}
      >
        <DetailPanel
          vendorId={vendorId}
          searchVendorDetail={props.searchVendorDetail}
          closePanel={props.closePanel}
          isLoading={props.isLoading}
          useJctRegistrationNumber={props.useJctRegistrationNumber}
        />
      </DraggableResizable>
    </div>
  );

  return vendorId ? wrapper : <></>;
};

export default DetailWrapper;
