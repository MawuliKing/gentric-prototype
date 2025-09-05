
import { Routes, Route, Navigate } from 'react-router-dom'
import { ApiDemo, StorageDemo, Layout, AdminLayout, CustomerLayout, AgentLayout } from './components'
import { ComponentShowcase } from './components/ComponentShowcase'
import { AuthProvider } from './contexts/AuthContext'
import { PrivateRoute } from './components/PrivateRoute'
import { Home, Login, Posts, Profile, AdminDashboard, CustomerDashboard, AgentDashboard, ProjectTypes, ProjectTypeDetails, FormBuilderPage, Agents, Customers, Projects } from './pages'
import { ACCOUNT_TYPE } from './types/api'



function App() {
  return (
    <Routes>
      {/* Public Routes */}
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

      {/* Protected Routes */}
      <Route path="/profile" element={
        <PrivateRoute>
          <Layout>
            <Profile />
          </Layout>
        </PrivateRoute>
      } />

      {/* Admin Dashboard - Only for ADMIN users */}
      <Route path="/admin" element={
        <PrivateRoute allowedRoles={[ACCOUNT_TYPE.ADMIN]}>
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </PrivateRoute>
      } />
      <Route path="/admin/project-types" element={
        <PrivateRoute allowedRoles={[ACCOUNT_TYPE.ADMIN]}>
          <AdminLayout>
            <ProjectTypes />
          </AdminLayout>
        </PrivateRoute>
      } />
      <Route path="/admin/project-types/:id" element={
        <PrivateRoute allowedRoles={[ACCOUNT_TYPE.ADMIN]}>
          <AdminLayout>
            <ProjectTypeDetails />
          </AdminLayout>
        </PrivateRoute>
      } />
      <Route path="/admin/project-types/:projectTypeId/templates/:templateId/edit" element={
        <PrivateRoute allowedRoles={[ACCOUNT_TYPE.ADMIN]}>
          <FormBuilderPage />
        </PrivateRoute>
      } />
      <Route path="/admin/agents" element={
        <PrivateRoute allowedRoles={[ACCOUNT_TYPE.ADMIN]}>
          <AdminLayout>
            <Agents />
          </AdminLayout>
        </PrivateRoute>
      } />
      <Route path="/admin/customers" element={
        <PrivateRoute allowedRoles={[ACCOUNT_TYPE.ADMIN]}>
          <AdminLayout>
            <Customers />
          </AdminLayout>
        </PrivateRoute>
      } />
      <Route path="/admin/projects" element={
        <PrivateRoute allowedRoles={[ACCOUNT_TYPE.ADMIN]}>
          <AdminLayout>
            <Projects />
          </AdminLayout>
        </PrivateRoute>
      } />

      {/* Customer Dashboard - Only for CUSTOMER users */}
      <Route path="/customer" element={
        <PrivateRoute allowedRoles={[ACCOUNT_TYPE.CUSTOMER]}>
          <CustomerLayout>
            <CustomerDashboard />
          </CustomerLayout>
        </PrivateRoute>
      } />

      {/* Agent Dashboard - Only for USER (Agent) users */}
      <Route path="/agent" element={
        <PrivateRoute allowedRoles={[ACCOUNT_TYPE.AGENT]}>
          <AgentLayout>
            <AgentDashboard />
          </AgentLayout>
        </PrivateRoute>
      } />

      {/* Catch all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
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
