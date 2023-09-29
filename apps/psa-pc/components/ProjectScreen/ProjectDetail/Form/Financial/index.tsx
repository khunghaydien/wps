import React from 'react';

import TextField from '@apps/commons/components/fields/TextField';
import FormField from '@apps/commons/components/psa/FormField';

import { Props } from '@psa/components/ProjectScreen/ProjectDetail/Form';

import './index.scss';

const FORM_ROOT = 'ts-psa__project-form';
const ROOT = `${FORM_ROOT}__finance`;

const Financial = (props: Props) => {
  const { refArray } = props;

  return (
    <section ref={refArray[2]} className={ROOT}>
      <h3 className={`${FORM_ROOT}__title`}>Financial Info</h3>

      <p className={`${ROOT}__subtitle`}>Target Revenue</p>

      <FormField title="Target Revenue">
        <TextField onChange={() => false} />
      </FormField>

      <FormField title="Target Margin">
        <TextField onChange={() => false} />
      </FormField>

      <FormField title="Target Cost">
        <TextField onChange={() => false} />
      </FormField>

      <p className={`${ROOT}__subtitle`}>Target Revenue</p>

      <FormField title="Planned Revenue">
        <TextField onChange={() => false} />
      </FormField>

      <FormField title="Margin">
        <TextField onChange={() => false} />
      </FormField>

      <FormField title="Planned Cost">
        <TextField onChange={() => false} />
      </FormField>

      <FormField title="Man-Hour Revenue">
        <TextField onChange={() => false} />
      </FormField>

      <FormField title="Man-Hour Cost">
        <TextField onChange={() => false} />
      </FormField>
    </section>
  );
};

export default Financial;
