import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import styled from 'styled-components';

import msg from '../languages';
import Spinner from './Spinner';

type Props = {
  totalCount: number;
  fetchedCount: number;
  child: JSX.Element[];
  fetchData: () => void;
  scrollableTargetId?: string; // id of overflow-scrollbar parent
  endMsg?: string; // end message displayed when scroll down to the last item
  marginBottom?: number; // custom margin bottom apply to loading spinner

  isRefreshEnabled?: boolean;
  // props for pull to refresh if isRefreshEnabled is true
  refreshData?: () => void;
  refreshThreshold?: number;
};

type LoaderProps = {
  customMargin?: number;
};

const S = {
  Wrapper: styled.p`
    display: flex;
    justify-content: center;
    font-size: 14px;
  `,
  Text: styled.span`
    padding-top: 2px;
    margin-left: 4px;
  `,
  End: styled.p`
    display: flex;
    justify-content: center;
    font-size: 14px;
    margin-top: 10px;
  `,
  Loader: {
    Wrapper: styled.div`
      position: relative;
      height: 40px;
      width: 40px;
      margin: 15px auto;
      z-index: 1;
      margin-bottom: ${(props: LoaderProps) =>
        `${props.customMargin}px` || '15px'};
    `,
    Spinner: styled(Spinner)`
      position: inherit !important;
    `,
  },
};

const TSInfiniteScroll = (props: Props) => {
  const [hasMore, setHasMore] = useState(true);
  const [isMoreLoaded, setIsMoreLoaded] = useState(false);

  const {
    totalCount,
    child,
    fetchedCount,
    isRefreshEnabled,
    refreshData,
    refreshThreshold = 100,
  } = props;

  useEffect(() => {
    setHasMore(fetchedCount < totalCount);
  }, [fetchedCount, totalCount]);

  const fetchData = () => {
    props.fetchData();
    setIsMoreLoaded(true);
  };

  const endMsg = isMoreLoaded && <S.End>{props.endMsg}</S.End>;
  const pullDownMsg = () => (
    <S.Wrapper>
      &#8595; <S.Text>{msg().Com_Lbl_PullToRefresh}</S.Text>
    </S.Wrapper>
  );
  const releaseMsg = () => (
    <S.Wrapper>
      &#8593; <S.Text>{msg().Com_Lbl_ReleaseToRefresh}</S.Text>
    </S.Wrapper>
  );
  const loadComponent = (
    <S.Loader.Wrapper customMargin={props.marginBottom}>
      <S.Loader.Spinner loading />
    </S.Loader.Wrapper>
  );

  const refreshEnabledProps = () =>
    (isRefreshEnabled && {
      refreshFunction: refreshData,
      pullDownToRefresh: true,
      pullDownToRefreshThreshold: refreshThreshold,
      pullDownToRefreshContent: pullDownMsg(),
      releaseToRefreshContent: releaseMsg(),
    }) ||
    {};

  return (
    <InfiniteScroll
      dataLength={fetchedCount}
      next={fetchData}
      hasMore={hasMore}
      loader={loadComponent}
      endMessage={endMsg}
      scrollableTarget={props.scrollableTargetId}
      {...refreshEnabledProps()}
    >
      {child}
    </InfiniteScroll>
  );
};

export default TSInfiniteScroll;
