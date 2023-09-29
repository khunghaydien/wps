import React from 'react';

import Skeleton from '../../../../Skeleton';

import './index.scss';

const ROOT = 'ts-expenses__form-record-item-skeleton';

const inputHeight = '32px';

const RecordSkeleton = () => {
  const date = (
    <Skeleton
      colWidth="168px"
      className={`${ROOT}__date`}
      rowHeight={inputHeight}
      margin="30px"
    />
  );

  const expType = (
    <Skeleton
      colWidth="45%"
      className={`${ROOT}__exp-type`}
      rowHeight={inputHeight}
      margin="30px"
    />
  );

  const amount = (
    <Skeleton
      noOfRow={2}
      noOfCol={2}
      colWidth="45%"
      className={`${ROOT}__amount`}
      rowHeight={inputHeight}
      margin="30px"
    />
  );

  const receipt = (
    <Skeleton
      colWidth="45%"
      className={`${ROOT}__receipt`}
      rowHeight="140px"
      margin="30px"
    />
  );

  const EIs = (
    <Skeleton
      noOfRow={5}
      colWidth="100%"
      className={`${ROOT}__extended-items`}
      rowHeight={inputHeight}
      margin="30px"
    />
  );

  return (
    <div className={ROOT}>
      {date} {expType} {amount} {receipt} {EIs}
    </div>
  );
};

export default RecordSkeleton;
