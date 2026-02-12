import { createContext, useContext, useState, useEffect } from 'react'

const ProjectContext = createContext()

export function ProjectProvider({ children }) {
  const [currentProject, setCurrentProject] = useState(null)
  const [allProjects, setAllProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch all projects
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setAllProjects(data)
        // Set first project as default, or load from localStorage
        const savedProjectId = localStorage.getItem('currentProjectId')
        const defaultProject = savedProjectId 
          ? data.find(p => p.id === parseInt(savedProjectId))
          : data[0]
        
        if (defaultProject) {
          setCurrentProject(defaultProject)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading projects:', err)
        setLoading(false)
      })
  }, [])

  const switchProject = (project) => {
    setCurrentProject(project)
    localStorage.setItem('currentProjectId', project.id)
  }

  return (
    <ProjectContext.Provider value={{ 
      currentProject, 
      allProjects, 
      switchProject,
      loading 
    }}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider')
  }
  return context
}