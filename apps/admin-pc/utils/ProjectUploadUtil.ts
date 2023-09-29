import csv from 'csv-parser';
import FileReaderStream from 'filereader-stream';

import { NAMESPACE_PREFIX } from '@apps/commons/api';
import msg from '@apps/commons/languages';
import TextUtil from '@apps/commons/utils/TextUtil';

import {
  CsvFileResponse,
  ProcessedFileResponse,
} from '@apps/domain/models/psa/ProjectUpload';

// this value should match BE configuration
const MAX_EXTENDED_ITEMS_ALLOWED = 20;
const requiredFields = [
  'ActTitle__c',
  'StartDate__c',
  'EndDate__c',
  'RequiredHours__c',
  'RoleTitle__c',
  'Status__c',
  'ResourceGroupCode__c',
];
const templateHeaders = {
  ActTitle__c: 'Activity Title',
  StartDate__c: 'Start Date',
  EndDate__c: 'End Date',
  RequiredHours__c: 'Required Hours',
  RoleTitle__c: 'Role Title',
  Status__c: 'Role Status',
  ResourceGroupCode__c: 'Resource Group Code',
};
export const downloadCsvTemplate = () => {
  const rows = [
    [
      'Activity Code*',
      'Activity Title*',
      'Start Date* (YYYY-MM-DD)',
      'End Date* (YYYY-MM-DD)',
      'Required Hours*',
      'Role Title*',
      'Role Status* (Planning/Requested/SoftBooked/Confirmed/InProgress/Completed/Cancelled)',
      'Resource Group Code*',
      'Assignee Code',
      'Skill Codes',
      'Grade Codes',
      'Scheduled Hours Per Day',
      'Work Hours Per Day',
      'Remarks',
      'Project Key',
    ],
  ];

  // Add extended item code and value
  for (let i = 1; i <= MAX_EXTENDED_ITEMS_ALLOWED; i++) {
    rows[0].push(`Extended Item ${i} Code`);
    rows[0].push(`Extended Item ${i} Value`);
  }

  const csvContent =
    'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'template.csv');
  link.setAttribute('target', '_blank');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const processCsvFile = async (
  file: File,
  projectId: string
): Promise<ProcessedFileResponse> => {
  let totalDataRowCount = 0;

  const results = [];

  let headerRow = [
    'ActivityCode__c',
    'ActTitle__c',
    'StartDate__c',
    'EndDate__c',
    'RequiredHours__c',
    'RoleTitle__c',
    'Status__c',
    'ResourceGroupCode__c',
    'AssigneeCode__c',
    'SkillCodes__c',
    'GradeCodes__c',
    'ScheduledHoursPerDay__c',
    'WorkHoursPerDay__c',
    'Remarks__c',
    'ProjectKey__c',
    'ExtendedItems__c',
    'ProjectId__c',
  ];

  const tempHeaderRows = headerRow.slice(0, 15);

  // Add extended item code and value
  for (let i = 1; i <= MAX_EXTENDED_ITEMS_ALLOWED; i++) {
    tempHeaderRows.push(`ExtendedItems__Code-${i}`);
    tempHeaderRows.push(`ExtendedItems__Value-${i}`);
  }

  headerRow = headerRow.map((col) => NAMESPACE_PREFIX + col);

  const response: ProcessedFileResponse = {
    file: null,
  };

  return new Promise((resolve) => {
    new FileReaderStream(file)
      .pipe(
        csv({
          strict: false,
          headers: tempHeaderRows,
        })
      )
      .on('data', (dataObject) => {
        if (totalDataRowCount === 1) {
          // Adding the Defined Header Row
          results.push(Object.keys(dataObject));
        }
        if (totalDataRowCount >= 1) {
          // WORKAROUND: Skip CSV header.
          //
          // csv-parser provides `skipLines` option to skip any lines from the beginning of the file.
          // However, `skipLines` does not work with `headers` option.
          // This is a bug and it has been already reported on Github.
          // See https://github.com/mafintosh/csv-parser/issues/110
          // The bug has been not fixed yet when the code was written, so as workaround,
          // avoid adding first row.
          // Add the correct template to header
          const extendedItems = [];
          let validExtendedItem = [];
          const dataRow = [];

          Object.keys(dataObject).forEach((key) => {
            if (requiredFields.includes(key)) {
              if (dataObject[key] === '') {
                if (response.error && response.error !== undefined) {
                  response.error += ',';
                } else {
                  response.error = '';
                }
                response.error +=
                  'Row ' +
                  totalDataRowCount +
                  ': ' +
                  msg().Psa_Lbl_RequiredField +
                  ': ' +
                  templateHeaders[key];
              }
              if (
                (key === 'ActTitle__c' || key === 'RoleTitle__c') &&
                dataObject[key].length > 80
              ) {
                const errorLabel =
                  key === 'ActTitle__c'
                    ? msg().Psa_Lbl_ActivityTitle
                    : msg().Psa_Lbl_ProjectRoleTitle;
                if (response.error && response.error !== undefined) {
                  response.error += ',';
                } else {
                  response.error = '';
                }
                response.error +=
                  'Row ' +
                  totalDataRowCount +
                  ': ' +
                  TextUtil.template(
                    msg().Psa_Err_MaxLengthOver,
                    errorLabel,
                    '80'
                  );
              }
            }

            const isActivityTitle = key.includes('ActTitle__c');
            const isRoleTitle = key.includes('RoleTitle__c');
            const isRemarks = key.includes('Remarks__c');
            const isExtendedItemCode = key.includes('ExtendedItems__Code');
            const isExtendedItemValue = key.includes('ExtendedItems__Value');
            const value = dataObject[key];

            if (isActivityTitle || isRoleTitle || isRemarks) {
              dataRow.push(encodeURIComponent(value));
            } else if (isExtendedItemCode) {
              if (value) {
                validExtendedItem.push(value);
              }
            } else if (isExtendedItemValue) {
              if (value) {
                validExtendedItem.push(encodeURIComponent(value));

                // Means it's a pair of code & value (validExtendedItem length = 2)
                if (validExtendedItem.length > 1) {
                  extendedItems.push(validExtendedItem.join(';'));
                }
              }
              // reset temp extended item array at the value stage every time.
              validExtendedItem = [];
            } else {
              dataRow.push(value);
            }
          });

          if (extendedItems.length > 0) {
            // processed extended items second last
            dataRow.push(extendedItems.join(';'));
          } else {
            dataRow.push('');
          }
          // projectId is always the last
          dataRow.push(projectId);

          results.push(dataRow);
        }

        totalDataRowCount += 1;
      })
      .on('error', (error: Error) => {
        response.error = JSON.stringify(error);
      })
      .on('end', () => {
        if (results.length === 0) {
          response.error = msg().Psa_Msg_ErrorNoContentInsideCSV;
        }
        results[0] = headerRow;
        const csvContent = results.map((e) => e.join(',')).join('\n');
        const blob = new Blob([csvContent], {
          type: 'data:text/csv;charset=utf-8',
        });

        response.file = new File([blob], file.name, {
          type: 'data:text/csv;charset=utf-8',
        });

        return resolve(response);
      });
  });
};

export const getCsvContent = async (
  file: File,
  projectId: string
): Promise<CsvFileResponse> => {
  let totalDataRowCount = 0;

  const results = [];

  let headerRow = [
    'ActivityCode__c',
    'ActTitle__c',
    'StartDate__c',
    'EndDate__c',
    'RequiredHours__c',
    'RoleTitle__c',
    'Status__c',
    'ResourceGroupCode__c',
    'AssigneeCode__c',
    'SkillCodes__c',
    'GradeCodes__c',
    'ScheduledHoursPerDay__c',
    'WorkHoursPerDay__c',
    'Remarks__c',
    'ProjectKey__c',
    'ExtendedItems__c',
    'ProjectId__c',
  ];

  const tempHeaderRows = headerRow.slice(0, 15);

  // Add extended item code and value
  for (let i = 1; i <= MAX_EXTENDED_ITEMS_ALLOWED; i++) {
    tempHeaderRows.push(`ExtendedItems__Code-${i}`);
    tempHeaderRows.push(`ExtendedItems__Value-${i}`);
  }

  headerRow = headerRow.map((col) => NAMESPACE_PREFIX + col);

  const response: CsvFileResponse = {
    CsvContent: null,
  };

  return new Promise((resolve) => {
    new FileReaderStream(file)
      .pipe(
        csv({
          strict: false,
          headers: tempHeaderRows,
        })
      )
      .on('data', (dataObject) => {
        if (totalDataRowCount === 1) {
          // Adding the Defined Header Row
          results.push(Object.keys(dataObject));
        }
        if (totalDataRowCount >= 1) {
          // WORKAROUND: Skip CSV header.
          //
          // csv-parser provides `skipLines` option to skip any lines from the beginning of the file.
          // However, `skipLines` does not work with `headers` option.
          // This is a bug and it has been already reported on Github.
          // See https://github.com/mafintosh/csv-parser/issues/110
          // The bug has been not fixed yet when the code was written, so as workaround,
          // avoid adding first row.
          // Add the correct template to header
          const extendedItems = [];
          let validExtendedItem = [];
          const dataRow = [];

          Object.keys(dataObject).forEach((key) => {
            if (requiredFields.includes(key)) {
              if (dataObject[key] === '') {
                if (response.error && response.error !== undefined) {
                  response.error += ',';
                } else {
                  response.error = '';
                }
                response.error +=
                  'Row ' +
                  totalDataRowCount +
                  ': ' +
                  msg().Psa_Lbl_RequiredField +
                  ': ' +
                  templateHeaders[key];
              }
              if (
                (key === 'ActTitle__c' || key === 'RoleTitle__c') &&
                dataObject[key].length > 80
              ) {
                const errorLabel =
                  key === 'ActTitle__c'
                    ? msg().Psa_Lbl_ActivityTitle
                    : msg().Psa_Lbl_ProjectRoleTitle;
                if (response.error && response.error !== undefined) {
                  response.error += ',';
                } else {
                  response.error = '';
                }
                response.error +=
                  'Row ' +
                  totalDataRowCount +
                  ': ' +
                  TextUtil.template(
                    msg().Psa_Err_MaxLengthOver,
                    errorLabel,
                    '80'
                  );
              }
            }

            const isActivityTitle = key.includes('ActTitle__c');
            const isRoleTitle = key.includes('RoleTitle__c');
            const isRemarks = key.includes('Remarks__c');
            const isExtendedItemCode = key.includes('ExtendedItems__Code');
            const isExtendedItemValue = key.includes('ExtendedItems__Value');
            const value = dataObject[key];

            if (isActivityTitle || isRoleTitle || isRemarks) {
              dataRow.push(encodeURIComponent(value));
            } else if (isExtendedItemCode) {
              if (value) {
                validExtendedItem.push(value);
              }
            } else if (isExtendedItemValue) {
              if (value) {
                validExtendedItem.push(encodeURIComponent(value));

                // Means it's a pair of code & value (validExtendedItem length = 2)
                if (validExtendedItem.length > 1) {
                  extendedItems.push(validExtendedItem.join(';'));
                }
              }
              // reset temp extended item array at the value stage every time.
              validExtendedItem = [];
            } else {
              dataRow.push(value);
            }
          });

          if (extendedItems.length > 0) {
            // processed extended items second last
            dataRow.push(extendedItems.join(';'));
          } else {
            dataRow.push('');
          }
          // projectId is always the last
          dataRow.push(projectId);

          results.push(dataRow);
        }

        totalDataRowCount += 1;
      })
      .on('error', (error: Error) => {
        response.error = JSON.stringify(error);
      })
      .on('end', () => {
        if (results.length === 0) {
          response.error = msg().Psa_Msg_ErrorNoContentInsideCSV;
        }
        results[0] = headerRow;
        response.CsvContent = results.map((e) => e.join(',')).join('\n');

        return resolve(response);
      });
  });
};
