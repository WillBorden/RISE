import { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import './RequirementsTable.css'

function RequirementsTable({ data, onEdit, onAdd, onDelete }) {
  const [sorting, setSorting] = useState([
    {
      id: 'requirement_id',
      desc: false,
    },
  ])
  const [filtering, setFiltering] = useState('')
  const [columnFilters, setColumnFilters] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)

  // Define columns
const columns = useMemo(
  () => [
    {
      accessorKey: 'requirement_id',
      header: 'ID',
      size: 120,
      cell: (info) => (
        <span className="cell-id">{info.getValue()}</span>
      ),
      sortingFn: (rowA, rowB, columnId) => {
        const aValue = rowA.getValue(columnId) || ''
        const bValue = rowB.getValue(columnId) || ''
        
        // Split by hyphen and compare each part
        const aParts = aValue.split('-')
        const bParts = bValue.split('-')
        
        // Compare each numeric part
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
          const aNum = parseInt(aParts[i]) || 0
          const bNum = parseInt(bParts[i]) || 0
          
          if (aNum !== bNum) {
            return aNum - bNum
          }
        }
        
        return 0
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      size: 400,
      cell: (info) => (
        <div className="cell-description">{info.getValue()}</div>
      ),
    },
    {
      accessorKey: 'requirement_type',
      header: 'Type',
      size: 120,
      cell: (info) => (
        <span className={`badge badge-${info.getValue()?.toLowerCase() || 'default'}`}>
          {info.getValue() || 'N/A'}
        </span>
      ),
      filterFn: 'equals',
    },
    {
      accessorKey: 'owner',
      header: 'Owner',
      size: 150,
    },
    {
      accessorKey: 'verification_type',
      header: 'V&V Type',
      size: 120,
    },
    {
      accessorKey: 'requirement_status',
      header: 'Status',
      size: 140,
      cell: (info) => {
        const status = info.getValue()
        if (!status) return <span className="text-muted">N/A</span>
        return (
          <span className={`status-badge status-${status.toLowerCase().replace(/\s+/g, '-')}`}>
            {status}
          </span>
        )
      },
      filterFn: 'equals',
      sortingFn: (rowA, rowB, columnId) => {
        const statusOrder = {
          'COMPLETED': 0,
          'IN PROGRESS': 1,
          'PLANNED': 2,
          'NOT STARTED': 3,
          'N/A': 4,
          '': 5  // Null/empty values go last
        }
        
        const aValue = rowA.getValue(columnId) || ''
        const bValue = rowB.getValue(columnId) || ''
        
        const aOrder = statusOrder[aValue] ?? 5
        const bOrder = statusOrder[bValue] ?? 5
        
        return aOrder - bOrder
      },
    },
    {
      accessorKey: 'source',
      header: 'Source',
      size: 150,
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 120,
      cell: (info) => (
        <div className="cell-actions">
          <button
            className="btn-icon btn-edit"
            onClick={() => onEdit && onEdit(info.row.original)}
            title="Edit"
          >
            ✏️
          </button>
          <button
            className="btn-icon btn-delete"
            onClick={() => onDelete && onDelete(info.row.original)}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      ),
    },
  ],
  [onEdit, onDelete]
)

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter: filtering,
      columnFilters,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 1000,
      },
    },
  })

  // Export to CSV
  const exportToCSV = () => {
    const headers = columns
      .filter(col => col.accessorKey) // Skip action column
      .map(col => col.header)
      .join(',')
    
    const rows = table.getFilteredRowModel().rows.map(row => 
      columns
        .filter(col => col.accessorKey)
        .map(col => {
          const value = row.getValue(col.accessorKey)
          // Escape commas and quotes
          const escaped = String(value || '').replace(/"/g, '""')
          return escaped.includes(',') ? `"${escaped}"` : escaped
        })
        .join(',')
    )
    
    const csv = [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `requirements_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="table-container">
      {/* Toolbar */}
      <div className="table-toolbar">
        <div className="toolbar-left">
          <input
            type="text"
            placeholder="Search all columns..."
            value={filtering}
            onChange={(e) => setFiltering(e.target.value)}
            className="search-input"
          />
          <select
            className="filter-select"
            onChange={(e) => {
              if (e.target.value === '') {
                setColumnFilters([])
              } else {
                setColumnFilters([{ id: 'requirement_type', value: e.target.value }])
              }
            }}
          >
            <option value="">All Types</option>
            <option value="SYSTEM">System</option>
            <option value="SUBSYSTEM">Subsystem</option>
            <option value="COMPONENT">Component</option>
          </select>
          <select
            className="filter-select"
            onChange={(e) => {
              if (e.target.value === '') {
                setColumnFilters(prev => prev.filter(f => f.id !== 'requirement_status'))
              } else {
                setColumnFilters(prev => [
                  ...prev.filter(f => f.id !== 'requirement_status'),
                  { id: 'requirement_status', value: e.target.value }
                ])
              }
            }}
          >
            <option value="">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="IN PROGRESS">In Progress</option>
            <option value="PLANNED">Planned</option>
            <option value="NOT STARTED">Not Started</option>
          </select>
          <select
            className="filter-select"
            onChange={(e) => {
              if (e.target.value === '') {
                setColumnFilters(prev => prev.filter(f => f.id !== 'owner'))
              } else {
                setColumnFilters(prev => [
                  ...prev.filter(f => f.id !== 'owner'),
                  { id: 'owner', value: e.target.value }
                ])
              }
            }}
          >
            <option value="">All owners</option>
            <option value="AEROSTRUCTURES">Aerostructures</option>
            <option value="AVIONICS">Avionics</option>
            <option value="PAYLOAD">Payload</option>
            <option value="PROPULSION">Propulsion</option>
            <option value="RECOVERY">Recovery</option>
          </select>
        </div>
        <div className="toolbar-right">
          <button className="btn-primary" onClick={() => onAdd && onAdd()}>
            + Add Requirement
          </button>
          <button className="btn-secondary" onClick={exportToCSV}>
            📊 Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-scroll-container">
        <table className="data-table-enhanced">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize() }}
                    onClick={header.column.getToggleSortingHandler()}
                    className={header.column.getCanSort() ? 'sortable' : ''}
                  >
                    <div className="header-content">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() && (
                        <span className="sort-indicator">
                          {header.column.getIsSorted() === 'asc' ? ' ▲' : ' ▼'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="table-pagination">
        <div className="pagination-info">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{' '}
          of {table.getFilteredRowModel().rows.length} results
        </div>
        <div className="pagination-controls">
          <button
            className="btn-pagination"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            ⏮
          </button>
          <button
            className="btn-pagination"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            ◀
          </button>
          <span className="page-indicator">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <button
            className="btn-pagination"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            ▶
          </button>
          <button
            className="btn-pagination"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            ⏭
          </button>
          <select
            className="page-size-select"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            <option value={1000}>All rows</option>
            <option value={10}>10 rows</option>
            <option value={20}>20 rows</option>
            <option value={50}>50 rows</option>
            <option value={100}>100 rows</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default RequirementsTable