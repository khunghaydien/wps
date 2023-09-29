import React, { useMemo } from 'react';

import format from 'date-fns/format';

import Tooltip from '@apps/commons/components/Tooltip';
import msg from '@apps/commons/languages';

import { RequestWithPeriod } from '@apps/domain/models/time-tracking/RequestWithPeriod';

import Alert from '../../atoms/Alert';

type Props = {
  requestAlert: RequestWithPeriod;
};

const UnsubmittedAlert = (props: Props) => {
  const { alert, startDate, endDate } = props.requestAlert;
  const startDateISOString = useMemo(() => {
    if (startDate) {
      return format(startDate, 'YYYY-MM-DD');
    }
    return '';
  }, [startDate]);
  const endDateISOString = useMemo(() => {
    if (endDate) {
      return format(endDate, 'YYYY-MM-DD');
    }
    return '';
  }, [endDate]);

  return alert ? (
    <Tooltip
      id="id-test-test-test"
      content={`${
        msg().Trac_Msg_UnsubmittedRequestAlert
      }(${startDateISOString} - ${endDateISOString})`}
      align="top left"
    >
      <div tabIndex={0}>
        <Alert>{msg().Trac_Lbl_UnsubmittedRequestAlert}</Alert>
      </div>
    </Tooltip>
  ) : null;
};

export default UnsubmittedAlert;
