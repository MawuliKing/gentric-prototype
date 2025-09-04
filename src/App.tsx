
import { Routes, Route } from 'react-router-dom'
import { ApiDemo, StorageDemo, Layout, AdminLayout, CustomerLayout, AgentLayout } from './components'
import { ComponentShowcase } from './components/ComponentShowcase'
import { AuthProvider } from './contexts/AuthContext'
import { Home, Login, Posts, Profile, AdminDashboard, CustomerDashboard, AgentDashboard } from './pages'



function App() {
  return (
    <Routes>
      {/* Main App Routes */}
      <Route path="/" element={
        <Layout>
          <Home />
        </Layout>
      } />
      <Route path="/posts" element={
        <Layout>
          <Posts />
        </Layout>
      } />
      <Route path="/components" element={
        <Layout>
          <ComponentShowcase />
        </Layout>
      } />
      <Route path="/login" element={
        <Layout>
          <Login />
        </Layout>
      } />
      <Route path="/profile" element={
        <Layout>
          <Profile />
        </Layout>
      } />
      <Route path="/storage-demo" element={
        <Layout>
          <StorageDemo />
        </Layout>
      } />
      <Route path="/api-demo" element={
        <Layout>
          <ApiDemo />
        </Layout>
      } />

      {/* Dashboard Routes */}
      <Route path="/admin" element={
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      } />
      <Route path="/customer" element={
        <CustomerLayout>
          <CustomerDashboard />
        </CustomerLayout>
      } />
      <Route path="/agent" element={
        <AgentLayout>
          <AgentDashboard />
        </AgentLayout>
      } />
    </Routes>
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
