import useApiStore from "../store/useApiStore";

const ErrorModal = () => {
  const { isErrorCount, failedRequest, resetErrorState } = useApiStore();

  if (!isErrorCount) return null;

  const handleRetry = async () => {
    if (failedRequest) {
      await failedRequest();
    }
    resetErrorState();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="p-6 rounded-lg shadow-lg w-80 text-center">
        <p className="text-lg font-bold text-white">
          데이터 요청에 실패했습니다.
        </p>
        <p className="text-sm text-white">재요청 하시겠습니까?</p>
        <div className="mt-4 flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={resetErrorState}
          >
            아니오
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            onClick={handleRetry}
          >
            예
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
