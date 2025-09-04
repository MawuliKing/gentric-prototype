
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button, Card, StatusBadge, DataTable, LoginForm, UserProfile, StorageDemo, ApiDemo } from './components'
import { ComponentShowcase } from './components/ComponentShowcase'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Home component
function Home() {
  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="text-display mb-4">Welcome to Gentric</h1>
        <p className="text-body-large text-secondary-600 max-w-2xl">
          Your comprehensive report generation platform for organizations. Create, manage, and distribute professional reports with ease.
        </p>
      </div>

      {/* Color Test Section */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-soft border border-secondary-200">
        <h2 className="text-heading-2 mb-4">Color System Test</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-primary-700 text-white p-4 rounded-md text-center">
            <p className="font-semibold">Primary</p>
            <p className="text-sm opacity-90">bg-primary-700</p>
          </div>
          <div className="bg-success-600 text-white p-4 rounded-md text-center">
            <p className="font-semibold">Success</p>
            <p className="text-sm opacity-90">bg-success-600</p>
          </div>
          <div className="bg-warning-600 text-white p-4 rounded-md text-center">
            <p className="font-semibold">Warning</p>
            <p className="text-sm opacity-90">bg-warning-600</p>
          </div>
          <div className="bg-error-600 text-white p-4 rounded-md text-center">
            <p className="font-semibold">Error</p>
            <p className="text-sm opacity-90">bg-error-600</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button variant="primary" size="md">Primary Button</Button>
          <Button variant="secondary" size="md">Secondary Button</Button>
          <Button variant="success" size="md">Success Button</Button>
          <Button variant="warning" size="md">Warning Button</Button>
          <Button variant="error" size="md">Error Button</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-heading-3 mb-2">Create Reports</h3>
          <p className="text-body-small mb-4">Design and build professional reports with our intuitive editor.</p>
          <Button variant="primary" size="sm">Get Started</Button>
        </Card>

        <Card>
          <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-heading-3 mb-2">Generate Fast</h3>
          <p className="text-body-small mb-4">Generate reports in seconds with our optimized processing engine.</p>
          <Button variant="success" size="sm">Learn More</Button>
        </Card>

        <Card>
          <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-heading-3 mb-2">Export & Share</h3>
          <p className="text-body-small mb-4">Export to multiple formats and share with your team instantly.</p>
          <Button variant="secondary" size="sm">View Options</Button>
        </Card>
      </div>
    </div>
  )
}

// About component
function About() {
  return (
    <div className="fade-in">
      <div className="max-w-4xl">
        <h1 className="text-heading-1 mb-6">About Gentric</h1>
        <Card padding="lg">
          <p className="text-body-large mb-6">
            Gentric is a modern report generation platform designed specifically for organizations that need to create, manage, and distribute professional reports efficiently.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-heading-3 mb-4">Our Mission</h3>
              <p className="text-body mb-4">
                To simplify the report generation process for organizations of all sizes, enabling teams to focus on insights rather than formatting.
              </p>
              <p className="text-body">
                We believe that powerful reporting tools should be accessible, intuitive, and reliable.
              </p>
            </div>

            <div>
              <h3 className="text-heading-3 mb-4">Key Features</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-body">
                  <StatusBadge status="success" className="mr-3">✓</StatusBadge>
                  Professional templates
                </li>
                <li className="flex items-center text-body">
                  <StatusBadge status="success" className="mr-3">✓</StatusBadge>
                  Real-time collaboration
                </li>
                <li className="flex items-center text-body">
                  <StatusBadge status="success" className="mr-3">✓</StatusBadge>
                  Multiple export formats
                </li>
                <li className="flex items-center text-body">
                  <StatusBadge status="success" className="mr-3">✓</StatusBadge>
                  Advanced analytics
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

// Login component
function Login() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="fade-in">
        <div className="text-center mb-8">
          <h1 className="text-heading-1 mb-4">Already Signed In</h1>
          <p className="text-body-large text-secondary-600">
            You are already authenticated. Visit your profile or continue using the application.
          </p>
        </div>
        <UserProfile />
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="text-center mb-8">
        <h1 className="text-heading-1 mb-4">Sign In to Gentric</h1>
        <p className="text-body-large text-secondary-600">
          Access your account to manage reports and collaborate with your team.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}

// Profile component
function Profile() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="fade-in">
        <div className="text-center mb-8">
          <h1 className="text-heading-1 mb-4">Authentication Required</h1>
          <p className="text-body-large text-secondary-600">
            Please sign in to view your profile.
          </p>
        </div>
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="text-center mb-8">
        <h1 className="text-heading-1 mb-4">User Profile</h1>
        <p className="text-body-large text-secondary-600">
          Manage your account settings and preferences.
        </p>
      </div>
      <UserProfile />
    </div>
  );
}

// Posts component with React Query example
function Posts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: () =>
      fetch('https://jsonplaceholder.typicode.com/posts')
        .then(res => res.json()),
  })

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-heading-1 mb-2">Sample Reports</h1>
        <p className="text-body-large text-secondary-600">
          Example data fetched using React Query to demonstrate our data fetching capabilities.
        </p>
      </div>

      {error && (
        <Card className="border-l-4 border-error">
          <div className="flex items-center">
            <StatusBadge status="error" className="mr-3">Error</StatusBadge>
            <p className="text-body">{error.message}</p>
          </div>
        </Card>
      )}

      {data && (
        <DataTable
          data={data.slice(0, 10)}
          columns={[
            {
              key: 'id',
              title: 'ID',
              width: '80px',
              render: (value) => <span className="text-caption">#{value}</span>
            },
            {
              key: 'title',
              title: 'Report Title',
              render: (value) => <span className="font-medium text-secondary-800">{value}</span>
            },
            {
              key: 'body',
              title: 'Description',
              render: (value) => (
                <span className="text-body-small text-secondary-600">
                  {value.length > 100 ? `${value.substring(0, 100)}...` : value}
                </span>
              )
            },
            {
              key: 'status',
              title: 'Status',
              width: '120px',
              render: () => <StatusBadge status="success">Active</StatusBadge>
            },
            {
              key: 'actions',
              title: 'Actions',
              width: '200px',
              render: () => (
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm">View</Button>
                  <Button variant="primary" size="sm">Export</Button>
                </div>
              )
            }
          ]}
          loading={isLoading}
          emptyMessage="No reports available"
          onRowClick={(item) => console.log('Row clicked:', item)}
        />
      )}
    </div>
  )
}

// Navigation component
function Navigation() {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-soft border-b border-secondary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-700 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-heading-3 text-secondary-900">Gentric</h1>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md ${location.pathname === '/'
                ? 'text-primary-700 bg-primary-50'
                : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md ${location.pathname === '/about'
                ? 'text-primary-700 bg-primary-50'
                : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                }`}
            >
              About
            </Link>
            <Link
              to="/posts"
              className={`text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md ${location.pathname === '/posts'
                ? 'text-primary-700 bg-primary-50'
                : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                }`}
            >
              Reports
            </Link>
            <Link
              to="/components"
              className={`text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md ${location.pathname === '/components'
                ? 'text-primary-700 bg-primary-50'
                : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                }`}
            >
              Components
            </Link>
            <Link
              to="/storage-demo"
              className={`text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md ${location.pathname === '/storage-demo'
                ? 'text-primary-700 bg-primary-50'
                : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                }`}
            >
              Storage Demo
            </Link>
            <Link
              to="/api-demo"
              className={`text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md ${location.pathname === '/api-demo'
                ? 'text-primary-700 bg-primary-50'
                : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                }`}
            >
              API Demo
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className={`text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md ${location.pathname === '/profile'
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                    }`}
                >
                  Profile
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-secondary-600">Welcome, {user?.name}</span>
                  <Button variant="secondary" size="sm" onClick={logout}>
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className={`text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md ${location.pathname === '/login'
                  ? 'text-primary-700 bg-primary-50'
                  : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                  }`}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-secondary-50">
      <Navigation />

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/components" element={<ComponentShowcase />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/storage-demo" element={<StorageDemo />} />
            <Route path="/api-demo" element={<ApiDemo />} />
          </Routes>
        </div>
      </main>
    </div>
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
