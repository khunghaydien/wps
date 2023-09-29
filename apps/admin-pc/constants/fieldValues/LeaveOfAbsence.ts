const fieldValues: {
  [fieldName: string]: {
    label: string;
    value: any;
  }[];
} = {
  countType: [
    {
      label: 'Att_Lbl_CountedAsAttendance',
      value: 'Attendance',
    },
    {
      label: 'Att_Lbl_CountedAsAbsence',
      value: 'Absence',
    },
    {
      label: 'Att_Lbl_NotWorkDay',
      value: 'NotWorkDay',
    },
  ],
};

export default fieldValues;
