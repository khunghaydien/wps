import React from 'react';

import classNames from 'classnames';

import TextUtil from '../utils/TextUtil';

import msg from '../languages';

// import './Pagination.scss';

const ROOT = 'ts-pager-info';

export type Props = {
  className?: string;
  currentPage: number;
  totalNum: number;
  pageSize: number;
  isOverLimit?: boolean;
};

const Pager = ({
  className,
  currentPage,
  pageSize,
  totalNum,
  isOverLimit,
}: Props) => {
  const cssName = classNames(ROOT, className);

  if (totalNum === 0) {
    return <div className={cssName}>{msg().Cmn_Lbl_PagerInfoZero}</div>;
  }

  const lastPageNum = Math.ceil(totalNum / pageSize);
  const first = `${(currentPage - 1) * pageSize + 1}`;
  const last = currentPage === lastPageNum ? totalNum : currentPage * pageSize;

  return (
    <div className={cssName}>
      {TextUtil.template(
        msg().Cmn_Lbl_PagerInfo,
        first,
        last,
        `${totalNum}${isOverLimit ? '+' : ''}`
      )}
    </div>
  );
};

export default Pager;
