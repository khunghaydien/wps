import * as React from 'react';

import styled from 'styled-components';

import { RestTimeReason } from '@attendance/domain/models/RestTimeReason';

import $Select from '@mobile/components/atoms/Fields/Select';

const Select = styled($Select)`
  &&& {
    height: 40px;

    select {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
`;

const { useCallback, useEffect, useMemo, useState } = React;

const RestReason: React.FC<{
  error?: boolean;
  value: RestTimeReason | null;
  restTimeReasons: RestTimeReason[];
  readOnly?: boolean;
  onUpdateReason: (value: RestTimeReason | null) => void;
}> = ({ error, value, restTimeReasons, readOnly, onUpdateReason }) => {
  const [initialValue] = useState(value);
  const reasonOptions = useMemo(() => {
    const options: React.ComponentProps<typeof Select>['options'] = [];
    if (!restTimeReasons || restTimeReasons.length <= 0) {
      options.push({
        value: '',
        label: '',
      });
    }
    if (
      initialValue &&
      !restTimeReasons?.some(({ id }) => id === initialValue.id)
    ) {
      options.push({
        value: initialValue.id,
        label: initialValue.name,
      });
    }
    options.push(
      ...(restTimeReasons || []).map((item) => ({
        value: item.id,
        label: item.name,
      }))
    );
    return options;
  }, [initialValue, restTimeReasons]);

  const onReasonChange = useCallback(
    (reasonId: string) => {
      let reason = restTimeReasons.find((item) => item.id === reasonId);
      if (!reason) {
        reason = reasonId === initialValue?.id ? initialValue : undefined;
      }
      onUpdateReason(reason);
    },
    [restTimeReasons, initialValue, onUpdateReason]
  );

  useEffect(() => {
    if (readOnly) {
      return;
    }
    if (!value && restTimeReasons?.length > 0) {
      onUpdateReason(restTimeReasons[0]);
    }
  }, [restTimeReasons]);

  return (
    <Select
      error={error}
      options={reasonOptions}
      value={value?.id}
      onChange={(e: React.SyntheticEvent<HTMLSelectElement>) =>
        onReasonChange(e.currentTarget.value)
      }
      readOnly={readOnly}
    />
  );
};

RestReason.defaultProps = {
  readOnly: false,
};

export default RestReason;
