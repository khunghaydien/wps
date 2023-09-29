import Api from '../api/local';
import { setupMessages } from '../languages';

const CUSTOM_METADATA = 'CustomMetadata';
const CUSTOM_LABEL_FOLDER = 'ComCustomLabel';
const CUSTOM_LABEL_METADATA = {
  type: CUSTOM_METADATA,
  folder: CUSTOM_LABEL_FOLDER,
};

/* eslint-disable @typescript-eslint/naming-convention */
const CUSTOM_LABEL_FILED = {
  ja: 'Ja_Custom__c',
  en_US: 'En_US_Custom__c',
};

const configureMessages = (): Promise<void> =>
  Api.listMetadata([CUSTOM_LABEL_METADATA])
    .then((metadata) => {
      // Collect fullnames of custom metadata
      const xs = Array.isArray(metadata) ? metadata : [metadata];

      return xs
        .filter(({ fullName }) => fullName.startsWith(CUSTOM_LABEL_FOLDER))
        .map((m) => m.fullName);
    })
    .then((customLabels) => {
      // Collect metadata of custom label
      return Api.readMetadata(CUSTOM_METADATA, customLabels).then((mds) =>
        Promise.resolve(mds)
      );
    })
    .then((metadata) => {
      // Format data for message dictionary
      const xs = Array.isArray(metadata) ? metadata : [metadata];

      const getMessageDictionary = (fieldName: string) => {
        return xs.reduce((acc, md) => {
          const key = md.fullName.replace(`${CUSTOM_LABEL_FOLDER}.`, '');
          const found = md.values.find((v) => v.field === fieldName);
          if (found && found.value && found.value._) {
            return {
              ...acc,
              [`$${key}`]: `${found.value._}`,
            };
          } else {
            return acc;
          }
        }, {});
      };

      window.customMessageMap = {
        ja: getMessageDictionary(CUSTOM_LABEL_FILED.ja),
        /* eslint-disable @typescript-eslint/naming-convention */
        en_US: getMessageDictionary(CUSTOM_LABEL_FILED.en_US),
      };
      setupMessages();
    });

export default (next: Function): void => {
  Promise.all([
    configureMessages(), // Add other preprocess for development
  ]).then(() => next());
};
