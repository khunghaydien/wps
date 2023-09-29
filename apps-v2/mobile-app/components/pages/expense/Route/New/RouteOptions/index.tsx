import React from 'react';

import msg from '../../../../../../../commons/languages';

import RadioButtonGroup from '../../../../../atoms/RadioButtonGroup';
import { RouteFormValues } from '../index';
import initRadioConfig from './radioConfig';

import './index.scss';

const ROOT = 'mobile-app-pages-expense-page-route-form__route-options';

type Props = {
  values: RouteFormValues;
  setValueForKey: (key: string) => any;
};

const RouteOptions = (props: Props) => {
  const radioConfig = initRadioConfig();

  return (
    <div className={`${ROOT}`}>
      <p className={`${ROOT}__title`}>{msg().Exp_Lbl_RouteSearchCondition}</p>
      <section className={`${ROOT}__route-sort`}>
        <RadioButtonGroup
          label={radioConfig.routeSort.labels}
          options={radioConfig.routeSort.options}
          value={props.values.option.routeSort}
          onChange={props.setValueForKey('option.routeSort')}
        />
      </section>

      <section className={`${ROOT}__highway-bus`}>
        <RadioButtonGroup
          label={radioConfig.highwayBus.labels}
          options={radioConfig.highwayBus.options}
          value={props.values.option.highwayBus}
          onChange={props.setValueForKey('option.highwayBus')}
        />
      </section>

      <section className={`${ROOT}__seat-preference`}>
        <RadioButtonGroup
          label={radioConfig.seatPreference.labels}
          options={radioConfig.seatPreference.options}
          value={props.values.option.seatPreference}
          onChange={props.setValueForKey('option.seatPreference')}
        />
      </section>

      {props.values.option.useChargedExpress !== '2' && (
        <section className={`${ROOT}__charged-express`}>
          <RadioButtonGroup
            label={radioConfig.useChargedExpress.labels}
            options={radioConfig.useChargedExpress.options}
            value={props.values.option.useChargedExpress}
            onChange={props.setValueForKey('option.useChargedExpress')}
          />
        </section>
      )}

      <section className={`${ROOT}__use-ex`}>
        <RadioButtonGroup
          label={radioConfig.useExReservation.labels}
          options={radioConfig.useExReservation.options}
          value={props.values.option.useExReservation}
          onChange={props.setValueForKey('option.useExReservation')}
        />
      </section>
    </div>
  );
};

export default RouteOptions;
