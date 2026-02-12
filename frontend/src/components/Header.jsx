import { useState } from 'react'
import { useProject } from '../contexts/ProjectContext'
import './Header.css'

function Header() {
  const { currentProject, allProjects, switchProject } = useProject()
  const [showProjectDropdown, setShowProjectDropdown] = useState(false)

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-logos">
          <img src="/ares_logo.png" alt="ARES Logo" className="logo-image" />
          <div className="logo-divider"></div>
          <div className="logo-placeholder">RISE</div>
        </div>
        
        <div className="header-project-selector">
          <div className="project-dropdown">
            <button 
              className="project-dropdown-button"
              onClick={() => setShowProjectDropdown(!showProjectDropdown)}
            >
              <span className="project-label">Project:</span>
              <span className="project-name">{currentProject?.name || 'Select Project'}</span>
              <span className="dropdown-arrow">{showProjectDropdown ? '▲' : '▼'}</span>
            </button>
            
            {showProjectDropdown && allProjects.length > 0 && (
              <div className="project-dropdown-menu">
                {allProjects.map(project => (
                  <div
                    key={project.id}
                    className={`project-dropdown-item ${project.id === currentProject?.id ? 'active' : ''}`}
                    onClick={() => {
                      switchProject(project)
                      setShowProjectDropdown(false)
                    }}
                  >
                    <div className="project-item-name">{project.name}</div>
                    <div className="project-item-type">{project.project_type}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header