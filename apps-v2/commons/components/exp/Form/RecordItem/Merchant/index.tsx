import React from 'react';

import get from 'lodash/get';

import LabelWithHint from '@commons/components/fields/LabelWithHint';
import msg from '@commons/languages';

import { Record } from '@apps/domain/models/exp/Record';

import QuickSearch, { Option } from '../../QuickSearch';
import { vendorFilters } from '../Vendor';

import './index.scss';

type Props = {
  expRecord: Record;
  isHighlight: boolean;
  isRequired: boolean;
  merchantError: string;
  readOnly: boolean;
  showVendorFilter: boolean;
  targetRecord: string;
  value: string;
  getRecentVendors: () => Promise<Option[]>;
  onClickVendorSearch: () => void;
  searchVendors: (keyword?: string) => Promise<Option[]>;
  toggleVendorDetail: (arg0: boolean) => void;
  updateReport: (arg0: string, arg1: string) => void;
};

const ROOT = 'ts-expenses-requests__merchant';

const RecordMerchant = (props: Props) => {
  const {
    targetRecord,
    isRequired,
    isHighlight,
    merchantError,
    value,
    showVendorFilter,
    readOnly,
    expRecord,
    updateReport,
    toggleVendorDetail,
    getRecentVendors,
    searchVendors,
    onClickVendorSearch,
  } = props;
  const selectedId = get(expRecord, `${targetRecord}.items.0.vendorId`, '');

  const handleChangeMerchant = (value: string) => {
    updateReport(`${targetRecord}.items.0.merchant`, value);
  };

  const onSelectVendor = (x: Option) => {
    if (!x.id) {
      handleChangeMerchant('');
      toggleVendorDetail(false);
      return;
    }
    updateReport(`${targetRecord}.items.0.merchant`, x.name);
  };

  return (
    <div className={`${ROOT} ts-text-field-container`}>
      <LabelWithHint
        text={msg().Exp_Clbl_Merchant}
        hintMsg={''}
        isRequired={isRequired}
      />
      <QuickSearch
        ROOT={ROOT}
        filters={showVendorFilter ? vendorFilters : []}
        disabled={readOnly}
        placeholder={''}
        selectedId={selectedId}
        targetDate={''}
        displayValue={value}
        onSelect={onSelectVendor}
        getRecentlyUsedItems={getRecentVendors}
        getSearchResult={searchVendors}
        openSearchDialog={onClickVendorSearch}
        isHighlight={isHighlight}
        onChange={handleChangeMerchant}
      />
      {merchantError && (
        <div className="input-feedback">{msg()[merchantError]}</div>
      )}
    </div>
  );
};

export default RecordMerchant;
