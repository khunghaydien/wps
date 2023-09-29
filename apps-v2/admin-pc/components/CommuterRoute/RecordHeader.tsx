import React from 'react';

// common methods
import msg from '../../../commons/languages/index';
import FormatUtil from '../../../commons/utils/FormatUtil';

// prop types
import { RouteItem } from '../../../domain/models/exp/jorudan/Route';

type Props = {
  item: RouteItem;
};
const CommuterRouteRecordHeader = (props: Props) => {
  const { item } = props;

  return (
    <div className="commuter-route__content__route-header">
      <p>
        1 {msg().Com_Lbl_Months}: ￥
        {FormatUtil.convertToIntegerString(item.fare1)}
      </p>
      <p>
        3 {msg().Com_Lbl_Months}: ￥
        {FormatUtil.convertToIntegerString(item.fare3)}
      </p>
      <p>
        6 {msg().Com_Lbl_Months}: ￥
        {FormatUtil.convertToIntegerString(item.fare6)}
      </p>
    </div>
  );
};

export default CommuterRouteRecordHeader;
