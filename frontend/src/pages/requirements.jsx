import { useState, useEffect } from 'react'
import RequirementsTable from '../components/RequirementsTable'

function Requirements() {
  const [requirements, setRequirements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/requirements')
      .then(res => res.json())
      .then(data => {
        setRequirements(data)
        setLoading(false)
      })
  }, [])

  const handleEdit = (requirement) => {
    console.log('Edit:', requirement)
    // TODO: Open edit modal
  }

  const handleAdd = () => {
    console.log('Add new requirement')
    // TODO: Open add modal
  }

  const handleDelete = (requirement) => {
    if (confirm(`Delete requirement ${requirement.requirement_id}?`)) {
      console.log('Delete:', requirement)
      // TODO: API call to delete
    }
  }

  if (loading) {
    return <div className="loading">Loading Requirements</div>
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Requirements</h1>
        <p className="text-muted">Manage and track all project requirements</p>
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