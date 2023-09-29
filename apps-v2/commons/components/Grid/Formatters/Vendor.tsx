import React from 'react';

const ROOT = 'commons-grid-formatters-vendor';

type ValueType = {
  recordVendor: Array<string>;
  reportVendor: string;
};

type Props = {
  value: ValueType;
};

const Vendor = (props: Props) => {
  const {
    value: { recordVendor, reportVendor },
  } = props;

  const uniqueRecordVendor = [...new Set(recordVendor ?? [])];

  return (
    <div className={ROOT}>{reportVendor || uniqueRecordVendor.join(', ')}</div>
  );
};

export default Vendor;
