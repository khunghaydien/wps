import * as React from 'react';

import reduce from 'lodash/reduce';

import styled from 'styled-components';

import AttTimeField from '@apps/commons/components/fields/AttTimeField';
import msg from '@apps/commons/languages';
import TimeUtil from '@apps/commons/utils/TimeUtil';
import Dropdown from '@apps/core/blocks/Dropdown';
import Button from '@apps/core/elements/Button';

import { ObjectivelyEventLogSetting } from '@attendance/domain/models/ObjectivelyEventLogSetting';

import {
  EventTypeCell,
  LinkedTimeCell,
  RemoveCell,
  Row,
  SourceCell,
  StampTimeCell,
  SyncCell,
} from './Table';
import objectivelyEventLogEventType, {
  EVENT_TYPE as OBJECTIVELY_EVENT_LOG_EVENT_TYPE,
  EventType as ObjectivelyEventLogEventType,
} from '@attendance/ui/helpers/objectivelyEventLog/eventType';

// FIXME: https://github.com/microsoft/TypeScript/issues/37597
// @ts-ignore
const Container = styled(Row)`
  height: 47px;
  padding: 0px 10px;
`;

const useEditor = ({
  sources,
  submit: $submit,
}: {
  sources: ObjectivelyEventLogSetting[];
  submit: (params: {
    settingCode: string;
    eventType: ObjectivelyEventLogEventType;
    time: number;
  }) => void;
}) => {
  // Source
  const [sourceValue, $setSourceValue] = React.useState<string>();
  const setSourceValue = React.useCallback(
    ({ value }: { id: string; value: string; label: string }) => {
      $setSourceValue(value);
    },
    [$setSourceValue]
  );
  const sourceOptions = React.useMemo(
    () =>
      sources.map((source) => ({
        id: source.id,
        value: source.code,
        label: source.name,
      })),
    [sources]
  );

  // Time
  const [timeValue, $setTimeValue] = React.useState<string>('');
  const setTimeValue = React.useCallback(
    (value: string) => {
      $setTimeValue(value);
    },
    [$setTimeValue]
  );

  // Event type
  const [eventTypeValue, $setEventTypeValue] =
    React.useState<ObjectivelyEventLogEventType>();
  const setEventTypeValue = React.useCallback(
    ({
      value,
    }: {
      id: string;
      value: ObjectivelyEventLogEventType;
      label: string;
    }) => {
      $setEventTypeValue(value);
    },
    [$setEventTypeValue]
  );
  const eventTypeOptions = React.useMemo(
    () =>
      reduce(
        OBJECTIVELY_EVENT_LOG_EVENT_TYPE,
        (options, value, key) => {
          options.push({
            id: key,
            value,
            label: objectivelyEventLogEventType(value),
          });
          return options;
        },
        []
      ),
    []
  );

  // Submit
  const submit = React.useCallback(() => {
    $submit({
      settingCode: sourceValue,
      eventType: eventTypeValue,
      time: TimeUtil.parseMinutes(timeValue),
    });
    $setSourceValue(null);
    $setEventTypeValue(null);
    $setTimeValue('');
  }, [
    sourceValue,
    eventTypeValue,
    timeValue,
    $submit,
    $setSourceValue,
    $setEventTypeValue,
    $setTimeValue,
  ]);
  const allowedSubmit = React.useMemo(
    () => !!(sourceValue && timeValue && eventTypeValue),
    [sourceValue, timeValue, eventTypeValue]
  );

  return {
    sourceValue,
    sourceOptions,
    eventTypeValue,
    eventTypeOptions,
    timeValue,
    setSourceValue,
    setEventTypeValue,
    setTimeValue,
    submit,
    allowedSubmit,
  };
};

const Footer: React.FC<{
  'data-testid'?: string;
  readOnly: boolean;
  loading: boolean;
  sources: ObjectivelyEventLogSetting[];
  submit: (params: {
    settingCode: string;
    eventType: ObjectivelyEventLogEventType;
    time: number;
  }) => void;
}> = ({
  'data-testid': testid,
  readOnly,
  loading,
  sources,
  submit: $submit,
}) => {
  const {
    sourceValue,
    sourceOptions,
    eventTypeValue,
    eventTypeOptions,
    timeValue,
    setSourceValue,
    setEventTypeValue,
    setTimeValue,
    submit,
    allowedSubmit,
  } = useEditor({
    sources,
    submit: $submit,
  });

  return (
    <Container data-testid={testid}>
      <SourceCell>
        <Dropdown
          data-testid={testid ? `${testid}-source-select` : ''}
          onSelect={setSourceValue}
          options={sourceOptions}
          value={sourceValue}
          readOnly={readOnly}
          disabled={loading}
        />
      </SourceCell>
      <EventTypeCell>
        <Dropdown
          data-testid={testid ? `${testid}-event-type-select` : ''}
          onSelect={setEventTypeValue}
          options={eventTypeOptions}
          value={eventTypeValue}
          readOnly={readOnly}
          disabled={loading}
        />
      </EventTypeCell>
      <StampTimeCell>
        <AttTimeField
          data-testid={testid ? `${testid}-time-input` : ''}
          onBlur={setTimeValue}
          value={timeValue}
        />
      </StampTimeCell>
      <SyncCell></SyncCell>
      <LinkedTimeCell></LinkedTimeCell>
      <RemoveCell>
        <Button
          data-testid={testid ? `${testid}-submit-button` : ''}
          color="default"
          onClick={submit}
          key="button-execute"
          disabled={!allowedSubmit || loading || readOnly}
        >
          {msg().Com_Btn_Add}
        </Button>
      </RemoveCell>
    </Container>
  );
};

Footer.defaultProps = {
  'data-testid': '',
};

export default Footer;
