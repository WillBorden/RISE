import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from './components/Header'
import Navigation from './components/navigation'
import Dashboard from './pages/dashboard'
import Requirements from './pages/requirements'
import Components from './pages/components'
import Simulation from './pages/simulation'
import Reports from './pages/reports'
import './App.css'

function App() {
  const [currentProject, setCurrentProject] = useState(null)

  useEffect(() => {
    // Fetch current project
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setCurrentProject(data[0])
        }
      })
  }, [])

  return (
    <Router>
      <div className="App">
        <Header currentProject={currentProject} />
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/requirements" element={<Requirements />} />
          <Route path="/components" element={<Components />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App