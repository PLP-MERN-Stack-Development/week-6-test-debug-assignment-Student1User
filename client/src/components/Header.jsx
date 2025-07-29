import { Link, useLocation } from "react-router-dom"

const Header = () => {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-brand">
          <Link to="/">MERN Testing App</Link>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/" className={isActive("/") ? "active" : ""} data-testid="home-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/users" className={isActive("/users") ? "active" : ""} data-testid="users-link">
              Users
            </Link>
          </li>
          <li>
            <Link to="/login" className={isActive("/login") ? "active" : ""} data-testid="login-link">
              Login
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
