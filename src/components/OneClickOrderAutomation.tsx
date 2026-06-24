'use client'

import React, { useState, useCallback } from 'react'
import { Send, Zap, CheckCircle, AlertCircle, Loader } from 'lucide-react'

interface OrderItem {
  id: string
  name: string
  quantity: number
  specifications?: string
}

interface OrderAutomationState {
  loading: boolean
  success: boolean
  error: string | null
  orderResult: any
}

export default function OneClickOrderAutomation() {
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [items, setItems] = useState<OrderItem[]>([
    { id: '1', name: '', quantity: 1, specifications: '' },
  ])
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>('normal')
  const [notes, setNotes] = useState('')
  const [state, setState] = useState<OrderAutomationState>({
    loading: false,
    success: false,
    error: null,
    orderResult: null,
  })

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), name: '', quantity: 1, specifications: '' },
    ])
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, field: keyof OrderItem, value: any) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const submitOrder = useCallback(async () => {
    // Validation
    if (!customerName.trim()) {
      setState({
        loading: false,
        success: false,
        error: 'Customer name is required',
        orderResult: null,
      })
      return
    }

    if (!customerEmail.trim()) {
      setState({
        loading: false,
        success: false,
        error: 'Customer email is required',
        orderResult: null,
      })
      return
    }

    if (items.some((item) => !item.name.trim())) {
      setState({
        loading: false,
        success: false,
        error: 'Please fill in all item names',
        orderResult: null,
      })
      return
    }

    setState({ loading: true, success: false, error: null, orderResult: null })

    try {
      const response = await fetch('/api/automation/submit-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'submit_order',
          order: {
            orderId: `ORD-${Date.now()}`,
            customerId: customerName.toLowerCase().replace(/\s+/g, '-'),
            items: items.map((item) => ({
              id: item.id,
              name: item.name,
              quantity: parseInt(item.quantity.toString(), 10),
              specifications: item.specifications,
            })),
            priority,
            notes: `Customer: ${customerName} | Email: ${customerEmail}\n${notes}`,
            metadata: {
              customerName,
              customerEmail,
              submittedAt: new Date().toISOString(),
            },
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setState({
          loading: false,
          success: true,
          error: null,
          orderResult: data.result,
        })

        // Reset form after 3 seconds
        setTimeout(() => {
          setCustomerName('')
          setCustomerEmail('')
          setItems([{ id: '1', name: '', quantity: 1, specifications: '' }])
          setNotes('')
          setPriority('normal')
          setState({
            loading: false,
            success: false,
            error: null,
            orderResult: null,
          })
        }, 3000)
      } else {
        setState({
          loading: false,
          success: false,
          error: data.error || 'Failed to submit order',
          orderResult: null,
        })
      }
    } catch (error) {
      setState({
        loading: false,
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit order',
        orderResult: null,
      })
    }
  }, [customerName, customerEmail, items, priority, notes])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              1-Click AI Order Automation
            </h1>
            <Zap className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-slate-400">
            Provide details once & let AI handle the rest
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-6 shadow-2xl">
          {/* Success/Error Messages */}
          {state.error && (
            <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-200 font-semibold">Error</p>
                <p className="text-red-300 text-sm">{state.error}</p>
              </div>
            </div>
          )}

          {state.success && (
            <div className="mb-6 p-4 bg-green-900 border border-green-700 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-green-200 font-semibold">Success!</p>
                <p className="text-green-300 text-sm">
                  Order submitted to AI automation engine. Processing...
                </p>
                {state.orderResult && (
                  <p className="text-green-300 text-xs mt-2">
                    Order ID: {state.orderResult.orderId}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Customer Information Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                1
              </span>
              Customer Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-slate-600 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="customer@email.com"
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-slate-600 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">
                2
              </span>
              Order Items
            </h2>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="p-4 bg-slate-700 rounded border border-slate-600 space-y-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        Item Name
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        placeholder="e.g., Part A, Custom Bracket"
                        className="w-full bg-slate-600 text-white px-3 py-2 rounded border border-slate-500 focus:outline-none focus:border-blue-500 text-sm transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value, 10))}
                        min="1"
                        className="w-full bg-slate-600 text-white px-3 py-2 rounded border border-slate-500 focus:outline-none focus:border-blue-500 text-sm transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        Specifications
                      </label>
                      <input
                        type="text"
                        value={item.specifications || ''}
                        onChange={(e) => updateItem(item.id, 'specifications', e.target.value)}
                        placeholder="Size, material, etc."
                        className="w-full bg-slate-600 text-white px-3 py-2 rounded border border-slate-500 focus:outline-none focus:border-blue-500 text-sm transition"
                      />
                    </div>
                  </div>

                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-300 text-sm font-medium transition"
                    >
                      Remove Item
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={addItem}
              className="mt-3 w-full bg-slate-700 hover:bg-slate-600 text-slate-300 px-4 py-2 rounded border border-dashed border-slate-600 transition"
            >
              + Add Another Item
            </button>
          </div>

          {/* Order Options Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm">
                3
              </span>
              Order Options
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Priority Level
                </label>
                <div className="space-y-2">
                  {(['normal', 'high', 'urgent'] as const).map((p) => (
                    <label key={p} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={priority === p}
                        onChange={() => setPriority(p)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-slate-300 capitalize">
                        {p === 'normal' && '⏱️ Normal (Standard Processing)'}
                        {p === 'high' && '🔥 High (Expedited)'}
                        {p === 'urgent' && '⚡ Urgent (Priority)'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions or preferences..."
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-slate-600 focus:outline-none focus:border-blue-500 transition h-24 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              onClick={submitOrder}
              disabled={state.loading}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-4 rounded-lg transition transform hover:scale-105 disabled:scale-100"
            >
              {state.loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Processing Order...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  1-CLICK SUBMIT TO AI
                </>
              )}
            </button>

            <button
              onClick={() => {
                setCustomerName('')
                setCustomerEmail('')
                setItems([{ id: '1', name: '', quantity: 1, specifications: '' }])
                setNotes('')
                setPriority('normal')
              }}
              className="px-6 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-4 rounded-lg transition"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="text-white font-semibold">Enter Details</h3>
            </div>
            <p className="text-slate-400 text-sm">Fill in customer info and order items</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="text-white font-semibold">Click Submit</h3>
            </div>
            <p className="text-slate-400 text-sm">AI processes order instantly</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="text-white font-semibold">Done!</h3>
            </div>
            <p className="text-slate-400 text-sm">Order sent to automation engine</p>
          </div>
        </div>
      </div>
    </div>
  )
}
