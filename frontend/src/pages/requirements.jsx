import { useState, useEffect } from 'react'
import { useProject } from '../contexts/ProjectContext'
import RequirementsTable from '../components/RequirementsTable'

function Requirements() {
  const { currentProject } = useProject()
  const [requirements, setRequirements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentProject) {
      setLoading(false)
      return
    }

    setLoading(true)
    fetch(`/api/requirements?project_id=${currentProject.id}`)
      .then(res => res.json())
      .then(data => {
        setRequirements(data)
        setLoading(false)
      })
  }, [currentProject]) // Re-fetch when project changes

  const handleEdit = (requirement) => {
    console.log('Edit:', requirement)
  }

  const handleAdd = () => {
    console.log('Add new requirement')
  }

  const handleDelete = (requirement) => {
    if (confirm(`Delete requirement ${requirement.requirement_id}?`)) {
      console.log('Delete:', requirement)
    }
  }

  if (loading) {
    return <div className="loading">Loading Requirements</div>
  }

  if (!currentProject) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h2>No Project Selected</h2>
          <p>Please select a project from the header to view requirements.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Requirements</h1>
        <p className="text-muted">
          Manage and track all requirements for {currentProject.name}
        </p>
      </div>
      
      <RequirementsTable
        data={requirements}
        onEdit={handleEdit}
        onAdd={handleAdd}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default Requirements