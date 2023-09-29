import { createWorkCategoryMap } from '../WorkCategory';

describe('domain/models/time-tracking/WorkCategory', () => {
  describe('createWorkCategoryMap', () => {
    test('it should create work category map from task list', () => {
      // Arrange
      const mockTaskList = [
        {
          id: '2a4bda58-b3a5-431f-a779-14d2637a2357',
          jobId: 'a0Q7F00000HajtmUAB',
          jobCode: 'Job1',
          jobName: 'Job1',
          isDirectCharged: true,
          workCategoryId: null,
          color: {
            base: '#0083b6',
            linked: '#00658c',
          },
          isDirectInput: true,
          volume: null,
          ratio: null,
          taskTime: 45,
          eventTaskTime: 0,
          hasJobType: true,
          workCategoryList: [
            {
              id: 'a0a7F000006fMi7QAE',
              code: 'B',
              name: '会議',
            },
            {
              id: 'a0a7F000006fMi2QAE',
              code: 'A',
              name: '開発',
            },
            {
              id: 'a0a7F000006fMiHQAU',
              code: 'C',
              name: '管理',
            },
          ],
        },
        {
          id: '84efb8d2-df16-43f1-ab89-74cf13160c41',
          jobId: 'a0Q7F00000HajtmUAB',
          jobCode: 'Job1',
          jobName: 'Job1',
          isDirectCharged: true,
          workCategoryId: 'a0a7F000006fMiHQAU',
          color: {
            base: '#00a3df',
            linked: '#007dab',
          },
          isDirectInput: true,
          volume: null,
          ratio: null,
          taskTime: 150,
          eventTaskTime: 0,
          hasJobType: true,
          workCategoryList: [
            {
              id: 'a0a7F000006fMi7QAE',
              code: 'B',
              name: '会議',
            },
            {
              id: 'a0a7F000006fMi2QAE',
              code: 'A',
              name: '開発',
            },
            {
              id: 'a0a7F000006fMiHQAU',
              code: 'C',
              name: '管理',
            },
          ],
        },
        {
          id: '970df7a9-455b-4fa3-9e8f-b1248291fe34',
          jobId: 'a0Q7F00000Hal6cUAB',
          jobCode: 'Job2',
          jobName: 'Job2',
          isDirectCharged: true,
          workCategoryId: 'a0a7F000006fMi7QAE',
          color: {
            base: '#6fbeda',
            linked: '#5592a8',
          },
          isDirectInput: false,
          volume: 410,
          ratio: 82,
          taskTime: null,
          eventTaskTime: 0,
          hasJobType: true,
          workCategoryList: [
            {
              id: 'a0a7F000006fMi7QAE',
              code: 'B',
              name: '会議',
            },
          ],
        },
        {
          id: '7d55610e-1022-4bdf-8a06-ff10da0dc414',
          jobId: 'a0Q7F00000Hal6cUAB',
          jobCode: 'Job2',
          jobName: 'Job2',
          isDirectCharged: true,
          workCategoryId: null,
          color: {
            base: '#79cca6',
            linked: '#5d9d80',
          },
          isDirectInput: false,
          volume: 95,
          ratio: 18,
          taskTime: null,
          eventTaskTime: 0,
          hasJobType: true,
          workCategoryList: [
            {
              id: 'a0a7F000006fMi7QAE',
              code: 'B',
              name: '会議',
            },
          ],
        },
      ];

      const expected = {
        [`a0Q7F00000HajtmUAB`]: [
          {
            id: 'a0a7F000006fMi7QAE',
            code: 'B',
            name: '会議',
          },
          {
            id: 'a0a7F000006fMi2QAE',
            code: 'A',
            name: '開発',
          },
          {
            id: 'a0a7F000006fMiHQAU',
            code: 'C',
            name: '管理',
          },
        ],
        [`a0Q7F00000Hal6cUAB`]: [
          {
            id: 'a0a7F000006fMi7QAE',
            code: 'B',
            name: '会議',
          },
        ],
      };

      // Run
      const actual = createWorkCategoryMap(mockTaskList as any);

      // Assert
      expect(actual).toEqual(expected);
    });
  });
  test('it should create work category map from selected work category', () => {
    // Arrange
    const mockTaskList = [
      {
        id: '2a4bda58-b3a5-431f-a779-14d2637a2357',
        jobId: 'a0Q7F00000HajtmUAB',
        jobCode: 'Job1',
        jobName: 'Job1',
        isDirectCharged: true,
        workCategoryId: 'a0a7F000006fMi2QAE',
        workCategoryName: '開発',
        workCategoryCode: 'A',
        color: {
          base: '#0083b6',
          linked: '#00658c',
        },
        isDirectInput: true,
        volume: null,
        ratio: null,
        taskTime: 45,
        eventTaskTime: 0,
        hasJobType: false,
        workCategoryList: [],
      },
    ];

    const expected = {
      [`a0Q7F00000HajtmUAB`]: [
        {
          id: 'a0a7F000006fMi2QAE',
          code: 'A',
          name: '開発',
        },
      ],
    };

    // Run
    const actual = createWorkCategoryMap(mockTaskList as any);

    // Assert
    expect(actual).toEqual(expected);
  });
});
