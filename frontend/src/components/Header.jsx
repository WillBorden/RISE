import { useState } from 'react'
import './Header.css'

function Header({ currentProject, onProjectSwitch }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-logos">
          <img src="/ares_logo.png" alt="ARES Logo" className="logo-image" />
          <div className="logo-divider"></div>
          <div className="logo-placeholder rise-logo">RISE</div>
        </div>
        
        <div className="header-project-info">
          <span className="project-name">{currentProject?.name || 'Select Project'}</span>
        </div>
      </div>
    </header>
  )
}

export default Header