import React from 'react';

import classNames from 'classnames';

import nextArrow from '../images/btnNextArrow.svg';
import prevArrow from '../images/btnPreviousArrow.svg';
import msg from '../languages';
import PagerInfo from './PagerInfo';

import './Pagination.scss';

const ROOT = 'ts-pager';

export type Props = {
  className?: string;
  currentPage: number;
  totalNum: number;
  displayNum: number;
  pageSize: number | Array<number>;
  maxPageNum: number;
  onClickPagerLink: (arg0: number) => void;
  havePagerInfo: boolean;
  onChangePageSize?: (arg0: number) => void;
  allowLargerPageSize?: boolean;
};

type State = {
  pageSize: number;
};

export default class Pager extends React.PureComponent<Props, State> {
  state = {
    pageSize: Array.isArray(this.props.pageSize)
      ? this.props.pageSize[0]
      : this.props.pageSize,
  };

  onChangePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetSize = Number(e.target.value);
    this.setState((prevState) => {
      return { pageSize: isNaN(targetSize) ? prevState.pageSize : targetSize };
    });
    const { onChangePageSize } = this.props;
    if (typeof onChangePageSize === 'function') {
      onChangePageSize(isNaN(targetSize) ? this.state.pageSize : targetSize);
    }
  };

  createCutomSizeOption = (
    pageSizeList: Array<number>,
    currentPage: number
  ) => {
    const { totalNum, allowLargerPageSize } = this.props;
    const res = [];
    pageSizeList.forEach((size) => {
      const disable = size * currentPage > totalNum;
      res.push(
        <option
          key={size}
          value={size}
          disabled={allowLargerPageSize ? !allowLargerPageSize : disable}
        >
          {size === totalNum ? msg().Com_Lbl_All : size}
        </option>
      );
    });
    return res;
  };

  createPager(totalPageNum: number) {
    const { currentPage } = this.props;
    // When the total number of pages is smaller than the displayed number,
    // the total number of pages is set as the upper limit
    const finalDisplayNum =
      totalPageNum < this.props.displayNum
        ? totalPageNum
        : this.props.displayNum;

    // central index
    const centerIdx = Math.floor(finalDisplayNum / 2);

    // Since display is treated as length, predicted total value with -1
    const prediction = currentPage + (finalDisplayNum - 1);

    // list start number
    let num = currentPage - centerIdx;

    if (currentPage <= centerIdx + 1) {
      num = 1;
    } else if (prediction > totalPageNum) {
      // If it exceeds the total number of pages, minus
      num = currentPage + (totalPageNum - prediction);
    }

    const pages = [];
    for (let i = 0; i < finalDisplayNum; i++) {
      pages.push(num + i);
    }

    return pages;
  }

  renderArrow(pageNum: number, next: boolean, disable: boolean) {
    const Arrow = next ? nextArrow : prevArrow;
    const prevClass = next ? '' : '-prev';
    return (
      <div className={`${ROOT}__page__item-placeholder`}>
        <div className={`${ROOT}__page__item-arrow${prevClass}`}>
          {disable || pageNum === this.props.currentPage ? (
            <Arrow />
          ) : (
            <a onClick={() => this.props.onClickPagerLink(pageNum)} href={null}>
              <Arrow />
            </a>
          )}
        </div>
      </div>
    );
  }

  renderPager(label: number | string, pageNum: number, disable: boolean) {
    const fillActive = pageNum === this.props.currentPage ? '-active' : '';
    return (
      <div className={`${ROOT}__page__item-placeholder`}>
        <div
          className={`${ROOT}__page__item${fillActive}`}
          key={`${label}${pageNum}`}
        >
          {disable || pageNum === this.props.currentPage ? (
            label
          ) : (
            <a onClick={() => this.props.onClickPagerLink(pageNum)} href={null}>
              {label}
            </a>
          )}
        </div>
      </div>
    );
  }

  render() {
    const {
      currentPage,
      totalNum,
      maxPageNum,
      havePagerInfo,
      pageSize: propsPageSize,
    } = this.props;
    const pageSize = this.state.pageSize;
    const lastPageNum = Math.ceil(totalNum / pageSize);
    const finalLastPageNum =
      maxPageNum < lastPageNum ? maxPageNum : lastPageNum;

    const pager = this.createPager(finalLastPageNum);
    const isVisibleFirstPage = pager[0] !== 1;
    const isVisibleEllipsisAfterFirstPage = pager[0] > 2;
    const isVisibleLastPage = pager[pager.length - 1] !== finalLastPageNum;
    const isVisibleEllipsisBeforeLastPage =
      pager[pager.length - 1] < finalLastPageNum;

    const cssName = classNames(ROOT, this.props.className);

    return (
      <div className={cssName}>
        {typeof propsPageSize === 'object' && (
          <div className={`${ROOT}-cutom-page-size`}>
            <select onChange={this.onChangePageSize}>
              {this.createCutomSizeOption(propsPageSize, currentPage)}
            </select>
          </div>
        )}
        {havePagerInfo && (
          <PagerInfo
            className={`${ROOT}-page-info`}
            currentPage={currentPage}
            totalNum={totalNum}
            pageSize={pageSize}
          />
        )}
        <div className={`${ROOT}__page`}>
          {this.renderArrow(currentPage - 1, false, currentPage < 2)}
          {isVisibleFirstPage && this.renderPager(1, 1, false)}
          {isVisibleEllipsisAfterFirstPage && <div>...</div>}
          {pager.map((page) => this.renderPager(page, page, false))}
          {isVisibleEllipsisBeforeLastPage && <div>...</div>}
          {isVisibleLastPage &&
            this.renderPager(finalLastPageNum, finalLastPageNum, false)}
          {this.renderArrow(
            currentPage + 1,
            true,
            currentPage === finalLastPageNum
          )}
        </div>
      </div>
    );
  }
}
