import React from 'react';

import msg from '../../../../../../commons/languages';
import Navigation, {
  Props as NavigationProps,
} from '../../../../molecules/commons/Navigation';
import ViewItem from '../../../../molecules/commons/ViewItem';

import {
  getVendorDisplayObject,
  VendorItem,
} from '../../../../../../domain/models/exp/Vendor';

import Wrapper from '../../../../atoms/Wrapper';

import './index.scss';

const ROOT = 'mobile-app-pages-approval-page-expense-report-vendor-detail';

type Props = NavigationProps & {
  vendorItem: VendorItem;
  useJctRegistrationNumber?: boolean;
};

const renderViewItem = (label: string, value: string | null | undefined) =>
  value && <ViewItem label={label}>{value}</ViewItem>;

export default (props: Props) => {
  const { vendorItem, title, useJctRegistrationNumber, onClickBack } = props;
  if (!vendorItem) {
    return null;
  }
  const keyValueInfo = getVendorDisplayObject(
    vendorItem,
    useJctRegistrationNumber
  );
  return (
    <Wrapper className={ROOT}>
      <Navigation
        title={title}
        onClickBack={onClickBack}
        backButtonLabel={msg().Com_Lbl_Back}
      />
      <div className="main-content">
        <section className={`${ROOT}__section`}>
          {Object.keys(keyValueInfo).map((key) =>
            renderViewItem(key, keyValueInfo[key])
          )}
        </section>
      </div>
    </Wrapper>
  );
};
