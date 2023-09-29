import { getSFObjFieldValues } from './sfObjFieldValues';

export const getLanguagePickList = () => {
  return getSFObjFieldValues([
    { key: 'language', path: '/language-picklist/get' },
  ]);
};

export default { getLanguagePickList };
