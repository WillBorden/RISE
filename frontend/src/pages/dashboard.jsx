import { useState, useEffect } from 'react'
import './dashboard.css'
import ProgressGauge from '../components/progressgauge'

function Dashboard() {
  const [projectData, setProjectData] = useState(null)
  const [requirements, setRequirements] = useState([])
  const [components, setComponents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showProjectModal, setShowProjectModal] = useState(false)

  useEffect(() => {
    // Fetch project data
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setProjectData(data[0]) // Use first project for now
        }
      })

    // Fetch requirements
    fetch('/api/requirements')
      .then(res => res.json())
      .then(data => {
        setRequirements(data)
        setLoading(false)
      })

    // Fetch components
    fetch('/api/components')
      .then(res => res.json())
      .then(data => setComponents(data))
  }, [])

  // Calculate progress metrics
  const requirementsProgress = requirements.length > 0
    ? (requirements.filter(r => r.requirement_status === 'COMPLETED').length / requirements.length) * 100
    : 0

  const componentsProgress = components.length > 0
    ? (components.filter(c => c.manufacturing_end_date).length / components.length) * 100
    : 0

  // Get upcoming milestones (placeholder)
  const upcomingMilestones = [
    { name: 'CDR', date: '2026-03-15', daysUntil: 37 },
    { name: 'Static Fire Test', date: '2026-04-01', daysUntil: 54 },
    { name: 'Flight Test', date: '2026-05-10', daysUntil: 93 }
  ]

  // Get overdue requirements
  const overdueRequirements = requirements.filter(r => 
    r.requirement_due_date && 
    new Date(r.requirement_due_date) < new Date() && 
    r.requirement_status !== 'COMPLETED'
  )

  // Calculate project statistics
  const totalMass = components.reduce((sum, c) => sum + ((c.mass || 0) * (c.quantity || 1)), 0)

  if (loading) {
    return <div className="loading">Loading Dashboard</div>
  }

  return (
    <div className="dashboard">
      {/* Top Section */}
      <div className="dashboard-top">
        {/* Left: Project Info */}
        <div className="dashboard-card project-info-card">
          <div className="card-header-row">
            <h2>Project Information</h2>
            <button className="btn-secondary" onClick={() => setShowProjectModal(true)}>
              Edit Project
            </button>
          </div>
          
          <div className="project-details">
            <div className="project-detail-item">
              <span className="detail-label">Project Name</span>
              <span className="detail-value">{projectData?.name || 'N/A'}</span>
            </div>
            <div className="project-detail-item">
              <span className="detail-label">Type</span>
              <span className="detail-value">{projectData?.project_type || 'N/A'}</span>
            </div>
            <div className="project-detail-item">
              <span className="detail-label">Target Altitude</span>
              <span className="detail-value">{projectData?.target_altitude ? `${projectData.target_altitude} ft` : 'N/A'}</span>
            </div>
            <div className="project-detail-item">
              <span className="detail-label">Start Date</span>
              <span className="detail-value">
                {projectData?.start_date ? new Date(projectData.start_date).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>

          <div className="project-description">
            <span className="detail-label">Description</span>
            <p>{projectData?.description || 'No description provided'}</p>
          </div>
        </div>

        {/* Right: Progress Overview */}
        <div className="dashboard-card progress-overview-card">
          <h2>Project Progress</h2>
          <div className="progress-gauges">
            <ProgressGauge 
              label="Requirements" 
              value={requirementsProgress} 
              total={requirements.length}
              completed={requirements.filter(r => r.requirement_status === 'COMPLETED').length}
            />
            <ProgressGauge 
              label="Manufacturing" 
              value={componentsProgress} 
              total={components.length}
              completed={components.filter(c => c.manufacturing_end_date).length}
            />
            <ProgressGauge 
              label="Testing" 
              value={45} 
              total={20}
              completed={9}
            />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="dashboard-bottom">
        {/* Left: Timeline & Milestones */}
        <div className="dashboard-card timeline-card">
          <h2>Timeline & Milestones</h2>
          
          {/* Gantt Chart Placeholder */}
          <div className="gantt-placeholder">
            <p className="text-muted">Gantt chart coming soon...</p>
          </div>

          {/* Upcoming Milestones */}
          <div className="milestones-section">
            <h3>Upcoming Milestones</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Milestone</th>
                  <th>Date</th>
                  <th>Days Until</th>
                </tr>
              </thead>
              <tbody>
                {upcomingMilestones.map((milestone, idx) => (
                  <tr key={idx}>
                    <td>{milestone.name}</td>
                    <td>{new Date(milestone.date).toLocaleDateString()}</td>
                    <td>{milestone.daysUntil} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Overdue Requirements */}
          {overdueRequirements.length > 0 && (
            <div className="overdue-section">
              <h3 className="text-danger">Overdue Requirements ({overdueRequirements.length})</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Description</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueRequirements.slice(0, 5).map((req) => (
                    <tr key={req.id}>
                      <td className="monospace">{req.requirement_id}</td>
                      <td className="truncate">{req.description}</td>
                      <td>{new Date(req.requirement_due_date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Project Statistics */}
        <div className="dashboard-card statistics-card">
          <h2>Project Statistics</h2>
          <div className="statistics-grid">
            <div className="stat-box">
              <span className="stat-label">Total Mass</span>
              <span className="stat-value">{totalMass.toFixed(2)} kg</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Total Length</span>
              <span className="stat-value">3.2 m</span>
              <span className="stat-note">From simulation</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Stability Margin</span>
              <span className="stat-value">2.1 cal</span>
              <span className="stat-note">From simulation</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Target Altitude</span>
              <span className="stat-value">{projectData?.target_altitude || 'N/A'} ft</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Max Velocity</span>
              <span className="stat-value">Mach 0.85</span>
              <span className="stat-note">From simulation</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Thrust-to-Weight</span>
              <span className="stat-value">5.2:1</span>
              <span className="stat-note">From simulation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard