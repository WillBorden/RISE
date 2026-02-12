import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ProjectProvider } from './contexts/ProjectContext'
import Header from './components/Header'
import Navigation from './components/navigation'
import Dashboard from './pages/dashboard'
import Requirements from './pages/requirements'
import Components from './pages/components'
import Simulation from './pages/simulation'
import Reports from './pages/reports'
import './App.css'

function App() {
  return (
    <ProjectProvider>
      <Router>
        <div className="App">
          <Header />
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
    </ProjectProvider>
  )
}

export default App