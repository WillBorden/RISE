import { NavLink } from 'react-router-dom'
import './navigation.css'

function Navigation() {
  return (
    <nav className="main-navigation">
      <div className="nav-content">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Dashboard
        </NavLink>
        <NavLink to="/requirements" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Requirements
        </NavLink>
        <NavLink to="/components" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Components
        </NavLink>
        <NavLink to="/simulation" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Simulation
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Reports
        </NavLink>
      </div>
    </nav>
  )
}

export default Navigation
