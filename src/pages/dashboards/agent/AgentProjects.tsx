import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable, Input, Select, StatusBadge, Progress } from '../../../components'
import { useAgentProjects } from '../../../hooks/useAgentProjects'
import { useAuth } from '../../../contexts/AuthContext'
import type { Project } from '../../../types/api'

const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CANCELLED', label: 'Cancelled' }
]

export const AgentProjects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const { user } = useAuth()
  const navigate = useNavigate()

  // Fetch projects for the current agent
  const { 
    projects: agentProjects, 
    loading: projectsLoading
  } = useAgentProjects({ 
    agentId: user?.id || '', 
    page: 1, 
    pageSize: 100 
  })

  // Filter projects based on search and filters
  const filteredProjects = agentProjects.filter(project => {
    const matchesSearch = searchTerm === '' ||
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.customer?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === '' || project.status === statusFilter
    const matchesType = typeFilter === '' || project.projectType.id === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  // Get unique project types for filter
  const projectTypes = Array.from(
    new Set(agentProjects.map(project => project.projectType))
  ).map(pt => ({
    value: pt.id,
    label: pt.name
  }))

  const columns = [
    {
      key: 'name' as keyof Project,
      title: 'Project',
      render: (_: any, project: Project) => (
        <div>
          <div className="font-medium text-secondary-900">{project.name}</div>
          <div className="text-sm text-secondary-500">{project.projectType.name}</div>
        </div>
      )
    },
    {
      key: 'customer' as keyof Project,
      title: 'Customer',
      render: (_: any, project: Project) => (
        <span className="text-sm font-medium text-secondary-900 truncate max-w-[120px] block" title={project.customer?.fullName || 'Unassigned'}>
          {project.customer?.fullName || 'Unassigned'}
        </span>
      )
    },
    {
      key: 'status' as keyof Project,
      title: 'Status',
      render: (_: any, project: Project) => (
        <StatusBadge
          status={project.status === 'ACTIVE' ? 'success' : project.status === 'COMPLETED' ? 'info' : project.status === 'PENDING' ? 'warning' : 'error'}
        >
          {project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1).toLowerCase() : 'Pending'}
        </StatusBadge>
      )
    },
    {
      key: 'reportProgress' as keyof Project,
      title: 'Report Progress',
      render: (_: any, project: Project) => {
        const progress = project.reportProgress || { totalReports: 0, completedReports: 0, inProgressReports: 0, pendingReports: 0 }
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary-600">Progress</span>
              <span className="font-medium text-secondary-900">
                {progress.completedReports}/{progress.totalReports}
              </span>
            </div>
            <Progress
              value={progress.totalReports > 0 ? (progress.completedReports / progress.totalReports) * 100 : 0}
              size="sm"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-secondary-500">
              <span>{progress.completedReports} completed</span>
              <span>{progress.inProgressReports} in progress</span>
              <span>{progress.pendingReports} pending</span>
            </div>
          </div>
        )
      }
    },
    {
      key: 'actions' as keyof Project,
      title: 'Actions',
      render: (_: any, project: Project) => (
        <div className="flex space-x-1 min-w-[80px]">
          <button
            className="px-3 py-1 text-xs bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            onClick={() => handleView(project)}
          >
            View
          </button>
        </div>
      )
    }
  ]

  const handleView = (project: Project) => {
    navigate(`/agent/projects/${project.id}`)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('')
    setTypeFilter('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-heading-1 mb-2">My Projects</h1>
          <p className="text-body-large text-secondary-600">
            View and track your assigned projects and their progress.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-secondary-200 shadow-soft">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'All Statuses' },
                ...statusOptions
              ]}
            />
          </div>
          <div>
            <Select
              placeholder="Filter by type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: '', label: 'All Types' },
                ...projectTypes
              ]}
              disabled={projectsLoading}
            />
          </div>
          <div className="flex items-end">
            <button
              className="w-full px-4 py-2 text-sm font-medium text-secondary-700 bg-secondary-100 border border-secondary-300 rounded-md hover:bg-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-secondary-200 shadow-soft">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Projects</p>
              <p className="text-2xl font-semibold text-secondary-900">{agentProjects.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-secondary-200 shadow-soft">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-success-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Active Projects</p>
              <p className="text-2xl font-semibold text-secondary-900">
                {agentProjects.filter(p => p.status === 'ACTIVE').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-secondary-200 shadow-soft">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-info-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-info-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Completed</p>
              <p className="text-2xl font-semibold text-secondary-900">
                {agentProjects.filter(p => p.status === 'COMPLETED').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-secondary-200 shadow-soft">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-warning-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Pending</p>
              <p className="text-2xl font-semibold text-secondary-900">
                {agentProjects.filter(p => p.status === 'PENDING').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-lg border border-secondary-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <DataTable
            data={filteredProjects}
            columns={columns}
            loading={projectsLoading}
            emptyMessage="No projects assigned to you. Contact your administrator to get assigned to projects."
          />
        </div>
      </div>
    </div>
  )
}
