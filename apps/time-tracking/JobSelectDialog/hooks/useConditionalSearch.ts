import { useCallback, useState } from 'react';

import { Jobable } from '@apps/domain/models/time-tracking/Job';

type PramType<T extends Jobable> = {
  repository: (arg0: { codeOrName: string }) => Promise<{
    isMoreThanRecordCount: boolean;
    records: Array<T>;
  }>;
  onOk: (arg0: T) => void;
  onError: (error: Error, arg1?: any) => void;
};

type ReturnType<T extends Jobable> = {
  conditionalSearch: () => void;
  codeOrNameQuery: string;
  setCodeOrNameQuery: (arg0: string) => void;
  isLoading: boolean;
  resultRecords: Array<T> | null;
  hasResultMoreThanRecordCount: boolean;
  selectedJob: T | null;
  onSelectJob: (T) => void;
  onOk: () => void;
};

const useConditionalSearch = <T extends Jobable>({
  repository,
  onOk,
  onError,
}: PramType<T>): ReturnType<T> => {
  const [codeOrNameQuery, setCodeOrNameQuery] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resultRecords, setResultRecords] = useState<Array<T> | null>(null);
  const [hasResultMoreThanRecordCount, setHasResultMoreThanRecordCount] =
    useState<boolean>(false);
  const [selectedJob, onSelectJob] = useState<T>(null);

  const clearAllResult = useCallback(() => {
    setResultRecords(null);
    setHasResultMoreThanRecordCount(false);
    onSelectJob(null);
  }, []);

  const conditionalSearch = useCallback(async () => {
    setIsLoading(true);
    clearAllResult();
    try {
      const { records, isMoreThanRecordCount } = await repository({
        codeOrName: codeOrNameQuery,
      });
      setResultRecords(records);
      setHasResultMoreThanRecordCount(isMoreThanRecordCount);
    } catch (e) {
      onError(e);
    } finally {
      setIsLoading(false);
    }
  }, [codeOrNameQuery, onError, repository]);

  const onOkCombined = useCallback(
    () => onOk(selectedJob),
    [onOk, selectedJob]
  );

  return {
    conditionalSearch,
    codeOrNameQuery,
    setCodeOrNameQuery,
    isLoading,
    resultRecords,
    hasResultMoreThanRecordCount,
    selectedJob,
    onSelectJob,
    onOk: onOkCombined,
  };
};

export default useConditionalSearch;
