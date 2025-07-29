const Home = () => {
  return (
    <div className="home" data-testid="home-page">
      <h1>Welcome to MERN Testing App</h1>
      <p>This application demonstrates comprehensive testing strategies for MERN stack applications.</p>

      <div className="features">
        <h2>Testing Features Implemented:</h2>
        <ul>
          <li>Unit Testing with Jest and React Testing Library</li>
          <li>Integration Testing for API endpoints</li>
          <li>End-to-End Testing with Cypress</li>
          <li>Error Boundaries for better error handling</li>
          <li>Debugging techniques and logging</li>
        </ul>
      </div>

      <div className="stats" data-testid="app-stats">
        <h3>Application Statistics</h3>
        <div className="stat-item">
          <span className="stat-label">Total Components:</span>
          <span className="stat-value" data-testid="component-count">
            8
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Test Coverage:</span>
          <span className="stat-value" data-testid="coverage-percentage">
            85%
          </span>
        </div>
      </div>
    </div>
  )
}

export default Home
