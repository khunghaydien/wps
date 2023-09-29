import React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';

import Component from '../../../components/molecules/attendance/RestTimeItem';

export default {
  title: 'Components/molecules/attendance/RestTimeItem',
  decorators: [withKnobs, (story: Function) => <div>{story()}</div>],
};

type Props = React.ComponentProps<typeof Component>;

const restTimeReasons = [
  {
    id: '00',
    code: '00',
    name: '00',
  },
];

const selectedRestReason = {
  id: '00',
  code: '00',
  name: '00',
};

type Pattern = [
  string,
  {
    startTime: number | null;
    endTime: number | null;
    isHiddenRemove: boolean;
    isDisabledRemove: boolean;
    readOnly: boolean;
    selectedRestReason: Props['selectedRestReason'];
    restTimeReasons: Props['restTimeReasons'];
  }
];

const patterns: Pattern[] = [
  [
    'Not input',
    {
      startTime: null,
      endTime: null,
      isHiddenRemove: false,
      isDisabledRemove: false,
      readOnly: false,
      selectedRestReason: null,
      restTimeReasons: [],
    },
  ],
  [
    'Disabled remove',
    {
      startTime: 9 * 60,
      endTime: 18 * 60,
      isHiddenRemove: false,
      isDisabledRemove: true,
      readOnly: false,
      selectedRestReason,
      restTimeReasons,
    },
  ],
  [
    'Hidden remove',
    {
      startTime: 9 * 60,
      endTime: 18 * 60,
      isHiddenRemove: true,
      isDisabledRemove: false,
      readOnly: false,
      selectedRestReason,
      restTimeReasons,
    },
  ],
  [
    'Disable & Hidden remove',
    {
      startTime: 9 * 60,
      endTime: 18 * 60,
      isHiddenRemove: true,
      isDisabledRemove: true,
      readOnly: false,
      selectedRestReason,
      restTimeReasons,
    },
  ],
  [
    'Read only',
    {
      startTime: 9 * 60,
      endTime: 18 * 60,
      isHiddenRemove: false,
      isDisabledRemove: false,
      readOnly: true,
      selectedRestReason,
      restTimeReasons,
    },
  ],
];

export const Default = () => (
  <table style={{ width: 460 }}>
    <tr>
      <th>Default</th>
      <td style={{ width: 375 }}>
        <Component
          label={text('label', '休憩１')}
          startTime={{
            value: number('startTime', 9 * 60),
            onChangeValue: action('onChangeStartTime'),
          }}
          endTime={{
            value: number('endTime', 18 * 60),
            onChangeValue: action('onChangeEndTime'),
          }}
          isDisabledRemove={boolean('isDisabledRemove', false)}
          readOnly={boolean('readOnly', false)}
          onClickRemove={action('onRemove')}
          enabledRestReason={boolean('enabledRestReason', false)}
          restTimeReasons={restTimeReasons}
          selectedRestReason={selectedRestReason}
          onUpdateReason={action('onChangeRestTimeReasons')}
        />
      </td>
    </tr>
    {patterns.map(([name, { startTime, endTime, ...param }]) => (
      <tr key={name}>
        <th>{name}</th>
        <td>
          <Component
            {...param}
            label={'休憩１'}
            startTime={{
              value: startTime,
              onChangeValue: action('onChangeStartTime'),
            }}
            endTime={{
              value: endTime,
              onChangeValue: action('onChangeEndTime'),
            }}
            enabledRestReason={false}
            onClickRemove={action('onRemove')}
            onUpdateReason={action('onChangeRestTimeReasons')}
          />
        </td>
      </tr>
    ))}
  </table>
);

export const WithRestReason = () => (
  <table style={{ width: 460 }}>
    {(
      [
        ...patterns,
        [
          'Selected rest reason is in option',
          {
            startTime: 9 * 60,
            endTime: 18 * 60,
            isHiddenRemove: false,
            isDisabledRemove: false,
            readOnly: false,
            selectedRestReason: restTimeReasons[0],
            restTimeReasons,
          },
        ],
        [
          'Selected rest reason is not in option',
          {
            startTime: 9 * 60,
            endTime: 18 * 60,
            isHiddenRemove: false,
            isDisabledRemove: false,
            readOnly: false,
            selectedRestReason: {
              id: 'a0A2800000FmMQCEA1',
              name: 'お昼休み',
              code: '001',
            },
            restTimeReasons,
          },
        ],
        [
          'Selected rest reason is long test',
          {
            startTime: 9 * 60,
            endTime: 18 * 60,
            isHiddenRemove: false,
            isDisabledRemove: false,
            readOnly: false,
            selectedRestReason: {
              id: 'a0A2800000FmMQCEA1',
              name: 'お昼休みお昼休みお昼休みお昼休みお昼休みお昼休みお昼休みお昼休みお昼休み',
              code: '002',
            },
            restTimeReasons,
          },
        ],
      ] as Pattern[]
    ).map(([name, { startTime, endTime, ...param }]) => (
      <tr key={name}>
        <th>{name}</th>
        <td style={{ width: 375 }}>
          <Component
            {...param}
            label={'休憩１'}
            startTime={{
              value: startTime,
              onChangeValue: action('onChangeStartTime'),
            }}
            endTime={{
              value: endTime,
              onChangeValue: action('onChangeEndTime'),
            }}
            enabledRestReason={true}
            onClickRemove={action('onRemove')}
            onUpdateReason={action('onChangeRestTimeReasons')}
          />
        </td>
      </tr>
    ))}
  </table>
);
