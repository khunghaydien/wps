import * as Yup from 'yup';

import msg from '@commons/languages';

import { isFieldEditable } from '@apps/domain/models/customRequest';
import {
  RECORD_ACCESS_FIELD_NAME,
  typeName,
} from '@apps/domain/models/customRequest/consts';
import { LayoutItem, Mode } from '@apps/domain/models/customRequest/types';

export const generateSchema = (configList: Array<LayoutItem>, mode: Mode) => {
  const shapeObj = {};
  configList.forEach((x) => {
    const isValidField = ![RECORD_ACCESS_FIELD_NAME].includes(x.field);
    const isEditable = isFieldEditable(x, mode);
    const isRequired = isValidField && isEditable && x.required;
    switch (x.typeName) {
      case typeName.CURRENCY:
      case typeName.DATE:
      case typeName.DATETIME:
      case typeName.MULTIPICKLIST:
      case typeName.PICKLIST:
      case typeName.REFERENCE:
      case typeName.TEXTAREA:
      case typeName.URL:
      case typeName.STRING:
        isRequired &&
          (shapeObj[x.field] = Yup.string()
            .nullable()
            .required(msg().Common_Err_Required));
        break;
      case typeName.DOUBLE:
        isRequired &&
          (shapeObj[x.field] = Yup.number().required(
            msg().Common_Err_Required
          ));
        break;
      case typeName.BOOLEAN:
        isRequired &&
          (shapeObj[x.field] = Yup.boolean().required(
            msg().Common_Err_Required
          ));
        break;
      default:
        break;
    }
  });
  return Yup.object().shape(shapeObj);
};
