import React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import Component from '../../../components/molecules/attendance/OtherRestTime';

export default {
  title: 'Components/molecules/attendance',
  decorators: [withKnobs, (story: Function) => <div>{story()}</div>],
};

export const OtherRestTime = () => (
  <>
    <table style={{ width: 460 }}>
      <tr>
        <th>Default</th>
        <td style={{ width: 375 }}>
          <Component
            label={text('label', 'その他の休憩時間')}
            readOnly={boolean('readOnly', false)}
            enabledRestReason={true}
            restTimeReasons={[
              {
                id: '00',
                code: '00',
                name: '00',
              },
            ]}
            otherRestReason={{
              value: {
                id: '00',
                code: '00',
                name: '00',
              },
              onChange: action('onChageRestTimeReason'),
            }}
          />
        </td>
      </tr>
      <tr>
        <th>Short</th>
        <td>
          <Component
            label={'その他の休憩時間'}
            readOnly={false}
            value={1}
            enabledRestReason={true}
            restTimeReasons={[
              {
                id: '00',
                code: '00',
                name: '1',
              },
            ]}
            otherRestReason={{
              value: {
                id: '00',
                code: '00',
                name: '1',
              },
              onChange: action('onChageRestTimeReason'),
            }}
          />
        </td>
      </tr>
      <tr>
        <th>Long</th>
        <td>
          <Component
            label={'その他の休憩時間'}
            readOnly={false}
            value={2880}
            enabledRestReason={true}
            restTimeReasons={[
              {
                id: '00',
                code: '00',
                name: '012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789',
              },
            ]}
            otherRestReason={{
              value: {
                id: '00',
                code: '00',
                name: '012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789',
              },
              onChange: action('onChageRestTimeReason'),
            }}
          />
        </td>
      </tr>
      <tr>
        <th>ReadOnly</th>
        <td>
          <Component
            label={'その他の休憩時間'}
            readOnly={true}
            enabledRestReason={true}
            restTimeReasons={[
              {
                id: '00',
                code: '00',
                name: '00',
              },
            ]}
            otherRestReason={{
              value: {
                id: '00',
                code: '00',
                name: '00',
              },
              onChange: action('onChageRestTimeReason'),
            }}
          />
        </td>
      </tr>
      <tr>
        <th>HasError</th>
        <td>
          <Component
            label={'その他の休憩時間'}
            readOnly={false}
            errors={['Error1', 'Error2']}
            enabledRestReason={true}
            restTimeReasons={[
              {
                id: '00',
                code: '00',
                name: '00',
              },
            ]}
            otherRestReason={{
              value: {
                id: '00',
                code: '00',
                name: '00',
              },
              onChange: action('onChageRestTimeReason'),
            }}
          />
        </td>
      </tr>
      <tr>
        <th>NoReason</th>
        <td>
          <Component
            label={'その他の休憩時間'}
            readOnly={true}
            value={5}
            enabledRestReason={false}
            restTimeReasons={[
              {
                id: '00',
                code: '00',
                name: '00',
              },
            ]}
            otherRestReason={{
              value: {
                id: '00',
                code: '00',
                name: '00',
              },
              onChange: action('onChageRestTimeReason'),
            }}
          />
        </td>
      </tr>
    </table>
  </>
);
