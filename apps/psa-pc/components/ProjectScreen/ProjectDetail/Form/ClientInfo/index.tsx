import React from 'react';

import SelectField from '@apps/commons/components/fields/SelectField';
import TextField from '@apps/commons/components/fields/TextField';
import FormField from '@apps/commons/components/psa/FormField';

import { Props } from '@psa/components/ProjectScreen/ProjectDetail/Form';

import './index.scss';

const FORM_ROOT = 'ts-psa__project-form';
const ROOT = `${FORM_ROOT}__client`;

const ClientInfo = (props: Props) => {
  const { refArray } = props;
  const contractOptions = [
    {
      value: 'flex',
      text: 'Flex',
    },
    {
      value: 'permanent',
      text: 'Permanent',
    },
  ];

  return (
    <section ref={refArray[1]} className={ROOT}>
      <h3 className={`${FORM_ROOT}__title`}>Client Info</h3>
      <FormField title="Client (Salesforce Account)">
        <TextField onChange={() => false} />
      </FormField>

      <FormField title="Opportunity (Salesforce Account)">
        <TextField onChange={() => false} />
      </FormField>

      <FormField title="Client Person in Charge (Salesforce Contact)">
        <TextField onChange={() => false} />
      </FormField>

      <FormField title="Contract Type">
        <SelectField onChange={() => false} options={contractOptions} />
      </FormField>
    </section>
  );
};

export default ClientInfo;
