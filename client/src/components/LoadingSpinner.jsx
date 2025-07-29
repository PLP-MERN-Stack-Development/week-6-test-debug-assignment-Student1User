const LoadingSpinner = ({ size = "medium", message = "Loading..." }) => {
  return (
    <div className={`loading-spinner ${size}`} data-testid="loading-spinner">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  )
}

export default LoadingSpinner
