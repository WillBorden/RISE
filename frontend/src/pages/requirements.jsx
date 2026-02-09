import { useState, useEffect } from 'react'

function Requirements() {
  const [requirements, setRequirements] = useState([])

  useEffect(() => {
    fetch('/api/requirements?limit=50')
      .then(res => res.json())
      .then(data => setRequirements(data))
  }, [])

  return (
    <div className="page-container">
      <h1>Requirements</h1>
      <p className="text-muted">Full requirements page coming soon...</p>
      <p className="text-muted">Total: {requirements.length} requirements</p>
    </div>
  )
}

export default Requirements