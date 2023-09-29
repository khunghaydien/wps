const approvalProcessList = [
  {
    type: '勤怠：休暇申請',
    emailTemplate: 'ABCDF-12345',
    finalApprovalAlert: { active: 'true', emailTemplate: 'ABCDF-12345' },
    finalRejectionAlert: { active: 'false', emailTemplate: 'ABCDF-12345' },
    recallAlert: { active: 'false', emailTemplate: 'ABCDF-12345' },
    steps: [
      {
        stepNo: 1,
        stepName: 'ステップ名1',
        whenMultipleApprovers: 'Unanimous',
        approvers: [
          {
            approverNo: 1,
            assignTo: '割当先',
            delegateTo: ['変更可能なユーザ'],
          },
          {
            approverNo: 2,
            assignTo: '割当先',
            delegateTo: ['変更可能なユーザ'],
          },
        ],
      },
      {
        stepNo: 2,
        stepName: 'ステップ名2',
        whenMultipleApprovers: 'FirstResponse',
        approvers: [
          {
            approverNo: 3,
            assignTo: '割当先',
            delegateTo: ['変更可能なユーザ'],
          },
          {
            approverNo: 4,
            assignTo: '割当先',
            delegateTo: ['変更可能なユーザ'],
          },
        ],
      },
    ],
  },
  {
    type: '勤怠：残業申請',
    emailTemplate: 'ABCDF-12345',
    finalApprovalAlert: { active: 'false', emailTemplate: 'ABCDF-12345' },
    finalRejectionAlert: { active: 'true', emailTemplate: 'ABCDF-12345' },
    recallAlert: { active: 'false', emailTemplate: 'ABCDF-12345' },
    steps: [
      {
        stepNo: 1,
        stepName: 'ステップ名1',
        whenMultipleApprovers: 'FirstResponse',
        approvers: [
          {
            approverNo: 1,
            assignTo: '割当先',
            delegateTo: ['変更可能なユーザ'],
          },
          {
            approverNo: 2,
            assignTo: '割当先',
            delegateTo: ['変更可能なユーザ'],
          },
        ],
      },
      {
        stepNo: 2,
        stepName: 'ステップ名2',
        whenMultipleApprovers: 'Unanimous',
        approvers: [
          {
            approverNo: 3,
            assignTo: '割当先',
            delegateTo: ['変更可能なユーザ'],
          },
          {
            approverNo: 4,
            assignTo: '割当先',
            delegateTo: ['変更可能なユーザ'],
          },
        ],
      },
    ],
  },
  {
    type: '・・・',
    emailTemplate: 'ABCDF-12345',
    finalApprovalAlert: { active: 'true', emailTemplate: 'ABCDF-12345' },
    finalRejectionAlert: { active: 'false', emailTemplate: 'ABCDF-12345' },
    recallAlert: { active: 'false', emailTemplate: 'ABCDF-12345' },
    steps: [],
  },
  {
    type: '経費精算：事前申請（国内出張）',
    emailTemplate: 'ABCDF-12345',
    finalApprovalAlert: { active: 'false', emailTemplate: 'ABCDF-12345' },
    finalRejectionAlert: { active: 'true', emailTemplate: 'ABCDF-12345' },
    recallAlert: { active: 'false', emailTemplate: 'ABCDF-12345' },
    steps: [
      {
        stepNo: 1,
        stepName: 'ステップ名1',
        whenMultipleApprovers: 'FirstResponse',
        approvers: [
          {
            approverNo: 1,
            assignTo: '割当先',
            delegateTo: ['変更可能なユーザ'],
          },
          {
            approverNo: 2,
            assignTo: '割当先',
            delegateTo: ['変更可能なユーザ'],
          },
        ],
      },
      {
        stepNo: 2,
        stepName: 'ステップ名2',
        whenMultipleApprovers: 'Unanimous',
        approvers: [
          {
            approverNo: 3,
            assignTo: '割当先',
            delegateTo: ['変更可能なユーザ'],
          },
          {
            approverNo: 4,
            assignTo: '割当先',
            delegateTo: ['変更可能なユーザ'],
          },
        ],
      },
    ],
  },
  {
    type: '経費精算：事前申請（海外出張）',
    emailTemplate: 'ABCDF-12345',
    finalApprovalAlert: { active: 'true', emailTemplate: 'ABCDF-12345' },
    finalRejectionAlert: { active: 'false', emailTemplate: 'ABCDF-12345' },
    recallAlert: { active: 'false', emailTemplate: 'ABCDF-12345' },
    steps: [],
  },
  {
    type: '経費精算：事前申請（会議・交際費）',
    emailTemplate: 'ABCDF-12345',
    finalApprovalAlert: { active: 'false', emailTemplate: 'ABCDF-12345' },
    finalRejectionAlert: { active: 'true', emailTemplate: 'ABCDF-12345' },
    recallAlert: { active: 'false', emailTemplate: 'ABCDF-12345' },
    steps: [
      {
        stepNo: 1,
        stepName: 'ステップ名1',
        whenMultipleApprovers: 'FirstResponse',
        approvers: [
          {
            approverNo: 1,
            assignTo: '割当先',
            delegateTo: ['変更可能なユーザ'],
          },
          {
            approverNo: 2,
            assignTo: '割当先',
            delegateTo: ['変更可能なユーザ'],
          },
        ],
      },
      {
        stepNo: 2,
        stepName: 'ステップ名2',
        whenMultipleApprovers: 'Unanimous',
        approvers: [
          {
            approverNo: 3,
            assignTo: '割当先',
            delegateTo: ['変更可能なユーザ'],
          },
          {
            approverNo: 4,
            assignTo: '割当先',
            delegateTo: ['変更可能なユーザ'],
          },
        ],
      },
    ],
  },
  {
    type: '・・・',
    emailTemplate: 'ABCDF-12345',
    finalApprovalAlert: { active: 'true', emailTemplate: 'ABCDF-12345' },
    finalRejectionAlert: { active: 'false', emailTemplate: 'ABCDF-12345' },
    recallAlert: { active: 'false', emailTemplate: 'ABCDF-12345' },
    steps: [
      {
        stepNo: 1,
        stepName: 'ステップ名1',
        whenMultipleApprovers: 'Unanimous',
        approvers: [
          {
            approverNo: 1,
            assignTo: '割当先',
            delegateTo: ['変更可能なユーザ'],
          },
          {
            approverNo: 2,
            assignTo: '割当先',
            delegateTo: ['変更可能なユーザ'],
          },
        ],
      },
      {
        stepNo: 2,
        stepName: 'ステップ名2',
        whenMultipleApprovers: 'FirstResponse',
        approvers: [
          {
            approverNo: 3,
            assignTo: '割当先',
            delegateTo: ['変更可能なユーザ'],
          },
          {
            approverNo: 4,
            assignTo: '割当先',
            delegateTo: ['変更可能なユーザ'],
          },
        ],
      },
    ],
  },
  {
    type: '・・・',
    emailTemplate: 'ABCDF-12345',
    finalApprovalAlert: { active: 'false', emailTemplate: 'ABCDF-12345' },
    finalRejectionAlert: { active: 'true', emailTemplate: 'ABCDF-12345' },
    recallAlert: { active: 'false', emailTemplate: 'ABCDF-12345' },
    steps: [
      {
        stepNo: 1,
        stepName: 'ステップ名1',
        whenMultipleApprovers: 'FirstResponse',
        approvers: [
          {
            approverNo: 1,
            assignTo: '割当先',
            delegateTo: ['変更可能なユーザ'],
          },
          {
            approverNo: 2,
            assignTo: '割当先',
            delegateTo: ['変更可能なユーザ'],
          },
        ],
      },
      {
        stepNo: 2,
        stepName: 'ステップ名2',
        whenMultipleApprovers: 'Unanimous',
        approvers: [
          {
            approverNo: 3,
            assignTo: '割当先',
            delegateTo: ['変更可能なユーザ'],
          },
          {
            approverNo: 4,
            assignTo: '割当先',
            delegateTo: ['変更可能なユーザ'],
          },
        ],
      },
    ],
  },
  {
    type: '工数：月次確定申請',
    emailTemplate: 'ABCDF-12345',
    finalApprovalAlert: { active: 'true', emailTemplate: 'ABCDF-12345' },
    finalRejectionAlert: { active: 'false', emailTemplate: 'ABCDF-12345' },
    recallAlert: { active: 'false', emailTemplate: 'ABCDF-12345' },
    steps: [],
  },
  {
    type: '工数：月次確定申請',
    emailTemplate: 'ABCDF-12345',
    finalApprovalAlert: { active: 'false', emailTemplate: 'ABCDF-12345' },
    finalRejectionAlert: { active: 'true', emailTemplate: 'ABCDF-12345' },
    recallAlert: { active: 'false', emailTemplate: 'ABCDF-12345' },
    steps: [
      {
        stepNo: 1,
        stepName: 'ステップ名1',
        whenMultipleApprovers: 'FirstResponse',
        approvers: [
          {
            approverNo: 1,
            assignTo: '割当先',
            delegateTo: ['変更可能なユーザ'],
          },
          {
            approverNo: 2,
            assignTo: '割当先',
            delegateTo: ['変更可能なユーザ'],
          },
        ],
      },
      {
        stepNo: 2,
        stepName: 'ステップ名2',
        whenMultipleApprovers: 'Unanimous',
        approvers: [
          {
            approverNo: 3,
            assignTo: '割当先',
            delegateTo: ['変更可能なユーザ'],
          },
          {
            approverNo: 4,
            assignTo: '割当先',
            delegateTo: ['変更可能なユーザ'],
          },
        ],
      },
    ],
  },
];

export default approvalProcessList;
