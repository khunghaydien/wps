import React from 'react';

import SearchFields, { Filters } from '@commons/components/exp/SearchFields';

import './AdvSearch.scss';

type Props = {
  baseFilters: Filters;
  extraFilters: Filters;
  onClickAdvSearchButton: () => void;
};

const AdvSearch = (props: Props) => {
  const baseSearchArea = (
    <SearchFields
      className="ts-expenses__search-area"
      searchBtnType="label"
      onClickSearch={props.onClickAdvSearchButton}
      filters={props.baseFilters as Filters}
    />
  );

  const extraSearchArea = (
    <SearchFields
      className="ts-expenses__search-area"
      filters={props.extraFilters as Filters}
    />
  );

  return (
    <>
      {baseSearchArea}
      {extraSearchArea}
    </>
  );
};

export default AdvSearch;
