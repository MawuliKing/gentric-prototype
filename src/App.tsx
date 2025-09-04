
import { Routes, Route } from 'react-router-dom'
import { ApiDemo, StorageDemo, Layout } from './components'
import { ComponentShowcase } from './components/ComponentShowcase'
import { AuthProvider } from './contexts/AuthContext'
import { Home, Login, Posts, Profile } from './pages'



function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/components" element={<ComponentShowcase />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/storage-demo" element={<StorageDemo />} />
        <Route path="/api-demo" element={<ApiDemo />} />
      </Routes>
    </Layout>
  )
}

// Main App wrapper with AuthProvider
function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWithAuth
