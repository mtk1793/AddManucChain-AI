'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Filter, Save, Trash2, Clock } from 'lucide-react'
import useSWR from 'swr'

const MOCK_SEARCH_RESULTS = [
  { id: '1', orderId: 'ORD-2025-001', partName: 'Titanium Bracket Assembly', status: 'completed', category: 'order' },
  { id: '2', orderId: 'ORD-2025-002', partName: 'Aluminum Frame', status: 'in-progress', category: 'order' },
  { id: '3', blueprintId: 'BP-2025-145', name: 'Engine Mount Blueprint', status: 'approved', category: 'blueprint' },
  { id: '4', centerId: 'CENTER-001', name: 'Manhattan Print Center', status: 'active', category: 'center' },
]

const MOCK_SAVED_FILTERS = [
  { id: '1', name: 'Pending Orders', entityType: 'order', filters: 'status:pending' },
  { id: '2', name: 'Recent Orders', entityType: 'order', filters: 'created:last_7_days' },
  { id: '3', name: 'Approved Blueprints', entityType: 'blueprint', filters: 'status:approved' },
]

export function AdvancedSearchPanel() {
  const [query, setQuery] = useState('')
  const [entityType, setEntityType] = useState('order')
  const [results, setResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [executionTime, setExecutionTime] = useState(0)
  const [savedFilters, setSavedFilters] = useState({ filters: MOCK_SAVED_FILTERS })
  const mutateSavedFilters = () => setSavedFilters({ filters: MOCK_SAVED_FILTERS })
  
  const handleSearch = async () => {
    if (!query) return
    
    setIsSearching(true)
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 500))
    setResults(MOCK_SEARCH_RESULTS.filter(r => 
      r.partName?.toLowerCase().includes(query.toLowerCase()) ||
      r.name?.toLowerCase().includes(query.toLowerCase())
    ))
    setExecutionTime(Math.random() * 200 + 50)
    setIsSearching(false)
  }
  
  const handleSaveFilter = async () => {
    const filterName = prompt('Enter filter name:')
    if (!filterName) return
    
    try {
      await fetch('/api/search', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: filterName,
          entityType,
          filters: { query },
          isPublic: false,
        }),
      })
      mutateSavedFilters()
    } catch (error) {
      console.error('Failed to save filter:', error)
    }
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Advanced Search</CardTitle>
          <CardDescription>Full-text search across orders, blueprints, centers, and reports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Select value={entityType} onValueChange={setEntityType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="order">Orders</SelectItem>
                <SelectItem value="blueprint">Blueprints</SelectItem>
                <SelectItem value="center">Centers</SelectItem>
                <SelectItem value="report">Reports</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={isSearching}>
              <Search className="w-4 h-4 mr-2" />
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
            <Button variant="outline" onClick={handleSaveFilter}>
              <Save className="w-4 h-4" />
            </Button>
          </div>
          
          {executionTime > 0 && (
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <Clock className="w-3 h-3" />
              Found {results.length} results in {executionTime}ms
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Results ({results.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-sm text-gray-500 p-4 text-center">No results. Try searching.</p>
            ) : (
              results.slice(0, 20).map((result: any) => (
                <div key={result.id} className="p-3 border rounded hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {result.orderId || result.blueprintId || result.name}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {result.partName || result.category || result.description}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {result.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
      {MOCK_SAVED_FILTERS.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Saved Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {MOCK_SAVED_FILTERS.map((filter: any) => (
                <Badge
                  key={filter.id}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setQuery(filter.filters)
                    setEntityType(filter.entityType)
                  }}
                >
                  {filter.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
