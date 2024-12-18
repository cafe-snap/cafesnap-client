const LoadingModal = () => {

  return(
    <div className="flex w-full min-h-screen justify-center items-center text-white text-5xl">
      <div className="absolute w-4 h-4 rounded-full bg-green-400 animate-bigBounce" />
      <div className="text-white text-lg font-light align-text-top ml-8 tracking-widest">
        데이터를 불러오는 중입니다
      </div>
    </div>
  );
};

export default LoadingModal;
