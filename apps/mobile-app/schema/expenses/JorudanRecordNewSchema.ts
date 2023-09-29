import _ from 'lodash';
import * as Yup from 'yup';

import getExtendedItemsValidators from './ExtendedItemSchema';

export default Yup.lazy(() => {
  return Yup.object().shape({
    items: Yup.array().of(
      Yup.object().shape({
        ...getExtendedItemsValidators(),
      })
    ),
  });
});
