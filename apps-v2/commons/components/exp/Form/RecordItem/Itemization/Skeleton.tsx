import React from 'react';

import Skeleton from '@commons/components/Skeleton';

import './Skeleton.scss';

const ROOT = 'ts-expenses__form-record-item-itemization-skeleton';

const INPUT_HEIGHT = '32px';
const ITEM_COUNT = 3;

const ItemizationSkeleton = () => {
  const totalAmount = (
    <Skeleton colWidth="45%" noOfCol={2} rowHeight={INPUT_HEIGHT} />
  );

  const itemization = (
    <>
      <Skeleton
        className={`${ROOT}__header`}
        colWidth="100%"
        rowHeight="50px"
      />
      <Skeleton
        className={`${ROOT}__itemization`}
        colWidth="30%"
        margin="35px"
        noOfCol={3}
        noOfRow={2}
        rowHeight={INPUT_HEIGHT}
      />
    </>
  );

  return (
    <div className={ROOT}>
      {totalAmount}
      {Array.from(Array(ITEM_COUNT)).map(() => itemization)}
    </div>
  );
};

export default ItemizationSkeleton;
