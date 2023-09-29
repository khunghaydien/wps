import React, { useEffect, useState } from 'react';

import get from 'lodash/get';

import {
  getVendorDisplayObject,
  VendorItemList,
} from '../../../../../domain/models/exp/Vendor';

import IconClose from '../../../../images/icons/close.svg';
import msg from '../../../../languages';
import Button from '../../../buttons/Button';
import Skeleton from '../../../Skeleton';

import './index.scss';

const ROOT = 'ts-expenses-vendor-detail-panel';

export const DRAG_HANDLE = `${ROOT}__drag-handle`;

export type PanelProps = {
  isLoading?: boolean;
  useJctRegistrationNumber?: boolean;
  vendorId?: string;
  closePanel: () => void;
  searchVendorDetail: (vendorId: string) => Promise<VendorItemList>;
};

const renderRow = (key, value) => {
  return value ? (
    <tr>
      <th>{key}</th>
      <td>{value}</td>
    </tr>
  ) : null;
};

const DetailPanel = (props: PanelProps) => {
  const [vendorInfo, setVendorInfo] = useState(null);
  const { searchVendorDetail, closePanel, vendorId, useJctRegistrationNumber } =
    props;

  useEffect(() => {
    setVendorInfo(null);
    if (vendorId) {
      searchVendorDetail(vendorId).then((res: VendorItemList) => {
        const info = get(res, 'records.0', null);
        setVendorInfo(info);
      });
    }
  }, [vendorId]);

  const keyValueInfo = vendorInfo
    ? getVendorDisplayObject(vendorInfo, useJctRegistrationNumber)
    : {};
  const infoRows = Object.keys(keyValueInfo).map((key) => {
    return renderRow(key, keyValueInfo[key]);
  });

  const container = (
    <div className={ROOT} data-testid={ROOT}>
      <div className={`${ROOT}__header`}>
        <div className={`${ROOT}__header-title ${DRAG_HANDLE}`}>
          {msg().Exp_Lbl_VendorDetail}
        </div>
        <Button type="text" className={`${ROOT}__close`} onClick={closePanel}>
          <IconClose aria-hidden="true" className={`${ROOT}__close-icon`} />
        </Button>
      </div>
      {props.isLoading ? (
        <Skeleton
          noOfRow={8}
          colWidth="100%"
          className={`${ROOT}__skeleton`}
          rowHeight="25px"
          margin="30px"
        />
      ) : (
        <div className={`${ROOT}__table`}>
          <table className={`${ROOT}__table-content`}>
            <tbody>{infoRows}</tbody>
          </table>
        </div>
      )}
    </div>
  );
  return container;
};

export default DetailPanel;
