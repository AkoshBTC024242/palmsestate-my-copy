function LoadingSpinner({ fullScreen = false }) {
  return (
    <div className={fullScreen ? "min-h-screen flex items-center justify-center" : "py-12 flex justify-center"}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
    </div>
  );
}

export default LoadingSpinner;
