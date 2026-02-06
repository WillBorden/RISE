import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [requirements, setRequirements] = useState([])
  const [components, setComponents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch requirements
    fetch('/api/requirements?limit=10')
      .then(res => res.json())
      .then(data => {
        setRequirements(data)
        setLoading(false)
      })
      .catch(err => console.error('Error fetching requirements:', err))

    // Fetch components
    fetch('/api/components?limit=10')
      .then(res => res.json())
      .then(data => setComponents(data))
      .catch(err => console.error('Error fetching components:', err))
  }, [])

  if (loading) {
    return <div className="loading">Loading RISE...</div>
  }

  return (
    <div className="App">
      <header>
        <h1>RISE</h1>
        <p>Rocket Integrated Systems Engineering</p>
      </header>

      <main>
        <section className="data-section">
          <h2>Requirements ({requirements.length})</h2>
          <div className="data-list">
            {requirements.map(req => (
              <div key={req.id} className="data-card">
                <h3>{req.requirement_id}</h3>
                <p>{req.description}</p>
                <div className="meta">
                  <span>Owner: {req.owner || 'N/A'}</span>
                  <span>Type: {req.requirement_type}</span>
                  <span>Status: {req.requirement_status || 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="data-section">
          <h2>Components ({components.length})</h2>
          <div className="data-list">
            {components.map(comp => (
              <div key={comp.id} className="data-card">
                <h3>{comp.part_id}</h3>
                <p>{comp.name}</p>
                <div className="meta">
                  <span>Type: {comp.item_type || 'N/A'}</span>
                  <span>Mass: {comp.mass ? `${comp.mass} kg` : 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
