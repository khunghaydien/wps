import React, { useCallback, useEffect, useMemo, useState } from 'react';

import styled, { createGlobalStyle } from 'styled-components';

import { Dropdown, Option as DropdownOption } from '@apps/core';

import { RestTimeReason } from '@attendance/domain/models/RestTimeReason';

const ROOT =
  'timesheet-pc-dialogs-daily-attentions-dialog-content-fields-rest-reason';

/**
 * FIXME: Portal に styled-component で style できないのでグローバルCSSを作成した。
 * （[filename].scss をインポートするのと同等になる）
 * いずれは Dropdown を修正して styled-component でサイズを修正できるようにしたい。
 */
const Style = createGlobalStyle<{ length: number }>`
  .${ROOT}__list-box {
    ${({ length }) => {
      const l = length <= 0 ? 1 : length > 7 ? 7 : length;
      // 1行高さ=30px, マージン上下合計=18px
      return ` height: ${l * 30 + 18}px;`;
    }}
  }
`;

const Option = styled.div`
  word-break: break-word;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 196px;
`;

const RestReason: React.FC<{
  value: RestTimeReason | null;
  restTimeReasons: RestTimeReason[];
  readOnly?: boolean;
  onUpdateReason: (value: RestTimeReason | null) => void;
}> = ({ value, restTimeReasons, readOnly, onUpdateReason }) => {
  const [initialValue] = useState(value);
  const reasonOptions = useMemo(() => {
    const options: DropdownOption[] = [];
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
        id: initialValue.id,
        value: initialValue.id,
        label: <Option title={initialValue.name}>{initialValue.name}</Option>,
      });
    }
    options.push(
      ...(restTimeReasons || []).map((item) => ({
        id: item.id,
        value: item.id,
        label: <Option title={item.name}>{item.name}</Option>,
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
    <>
      <Style length={reasonOptions?.length || 0} />
      <Dropdown
        options={reasonOptions}
        value={value?.id}
        listBoxClassName={`${ROOT}__list-box`}
        onSelect={(option) => onReasonChange(option.value)}
        readOnly={readOnly}
      />
    </>
  );
};

RestReason.defaultProps = {
  readOnly: false,
};

export default RestReason;
