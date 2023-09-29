import React from 'react';

import TaxTypeConfigContainer, {
  OwnProps,
} from '../../containers/TaxTypeConfigContainer';

const TaxTypeConfigComponent = (props: OwnProps) => (
  <TaxTypeConfigContainer {...props} />
);

export default TaxTypeConfigComponent;
