# Order Automation System Documentation

## Overview

The Order Automation System is a comprehensive framework for automating order processing workflows in the AddManuChain Dashboard. It uses an AI-powered agent to handle complex business logic while maintaining deterministic, observable behavior through a structured event system.

## Architecture

### Core Components

1. **Order Automation Agent** (`lib/order-automation-agent.ts`)
   - Central AI engine that processes orders
   - Manages order state and execution history
   - Provides statistics and monitoring

2. **Workflow Automation Builder** (`components/WorkflowAutomationBuilder.tsx`)
   - React component for visual workflow creation
   - Manages workflow rules and automation configurations
   - Provides real-time execution monitoring

3. **API Endpoint** (`app/api/automation/submit-order/route.ts`)
   - REST API for order submission and automation control
   - Handles workflow execution and status tracking
   - Supports configuration updates and system reset

### Data Models

```typescript
// Order submitted for automation
interface AutomatedOrder {
  orderId: string
  customerId: string
  items: OrderItem[]
  priority: 'normal' | 'high' | 'urgent'
  notes?: string
  submittedAt?: Date
}

// Represents a workflow step
interface WorkflowStep {
  id: string
  name: string
  type: 'trigger' | 'condition' | 'action' | 'notification'
  config: Record<string, unknown>
}

// Complete automation rule
interface AutomationRule {
  id: string
  name: string
  enabled: boolean
  steps: WorkflowStep[]
  createdAt: Date
  lastExecuted?: Date
  executionCount: number
}

// System metrics
interface AutomationMetrics {
  totalRules: number
  activeRules: number
  executionsToday: number
  successRate: number
  averageExecutionTime: number
}
```

## API Reference

### GET Endpoints

**Get Status of Order**
```
GET /api/automation/submit-order?action=status&orderId={orderId}
Response: { success: boolean, status: OrderStatus }
```

**Get System Statistics**
```
GET /api/automation/submit-order?action=stats
Response: { success: boolean, stats: AutomationMetrics, config: AutomationConfig }
```

**Get Orders Pending Attention**
```
GET /api/automation/submit-order?action=pending_orders
Response: { success: boolean, pendingOrders: Order[], count: number }
```

### POST Endpoints

**Submit Order for Automation**
```
POST /api/automation/submit-order
Body: {
  action: 'submit_order',
  order: {
    orderId: string,
    customerId: string,
    items: OrderItem[],
    priority: 'normal' | 'high' | 'urgent',
    notes?: string
  }
}
Response: { success: boolean, result: OrderResult }
```

**Update Configuration**
```
POST /api/automation/submit-order
Body: {
  action: 'update_config',
  config: AutomationConfig
}
Response: { success: boolean, message: string, config: AutomationConfig }
```

## Frontend Integration

### Using WorkflowAutomationBuilder Component

```typescript
import WorkflowAutomationBuilder from '@/components/WorkflowAutomationBuilder'

export default function AutomationPage() {
  return <WorkflowAutomationBuilder />
}
```

### Manual Workflow Execution

```typescript
// Execute a workflow programmatically
const executeWorkflow = async (workflowId: string, orderData: object) => {
  const response = await fetch('/api/automation/submit-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'submit_order',
      order: orderData
    })
  })
  return response.json()
}
```

## Workflow Configuration

### Default Configuration

```typescript
const DEFAULT_AUTOMATION_CONFIG = {
  maxConcurrentOrders: 10,
  defaultRetries: 3,
  executionTimeout: 30000, // 30 seconds
  notificationLevel: 'error' as const,
  autoRetry: true,
  batchSize: 5,
}
```

### Creating Custom Workflows

1. **Create a new rule** via the UI or API
2. **Define workflow steps:**
   - **Trigger**: When the workflow should execute
   - **Condition**: Validation logic
   - **Action**: Core processing steps
   - **Notification**: Alert configuration

3. **Enable and monitor** through the dashboard

## Workflow Step Types

### Trigger Steps
Determines when workflow should begin
- Order received
- Customer action
- Time-based schedule
- System event

### Condition Steps
Validate or filter orders
- Amount limits
- Customer status
- Inventory availability
- Business rules

### Action Steps
Execute core business logic
- Process payment
- Update inventory
- Create shipment
- Generate documents

### Notification Steps
Send alerts and updates
- Email notification
- SMS alert
- Dashboard notification
- Webhook callback

## Monitoring and Metrics

### Key Metrics
- **Total Rules**: Number of automation rules created
- **Active Rules**: Rules currently enabled
- **Executions Today**: Orders processed in current day
- **Success Rate**: Percentage of successful executions
- **Average Execution Time**: Mean processing time in milliseconds

### Dashboard Visualizations
1. **Execution Time Chart**: Shows processing duration for recent workflows
2. **Metrics Overview**: Bar chart of key system metrics
3. **Execution Status Panel**: Real-time result of last execution

## Error Handling

The system provides comprehensive error handling:

```typescript
// API Errors
- 400 Bad Request: Invalid action or missing parameters
- 500 Internal Server Error: Processing failure

// Execution Errors
- Configuration errors are caught and reported
- Failed executions trigger notifications
- All errors logged to execution history
```

## Best Practices

### Workflow Design
1. Keep workflows focused on single responsibilities
2. Use conditions to filter/validate before actions
3. Add notifications for critical operations
4. Set appropriate priority levels for orders

### Performance
1. Limit concurrent order count based on system capacity
2. Use batching for bulk operations
3. Monitor average execution time
4. Review and optimize slow workflows

### Monitoring
1. Check dashboard daily for anomalies
2. Review failed executions in history
3. Monitor success rate trends
4. Track execution time patterns

## Configuration Management

### Update System Configuration

```typescript
const updateConfig = async (newConfig: Partial<AutomationConfig>) => {
  const response = await fetch('/api/automation/submit-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'update_config',
      config: newConfig
    })
  })
  return response.json()
}
```

### Reset System

```typescript
const resetSystem = async () => {
  const response = await fetch('/api/automation/submit-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'reset'
    })
  })
  return response.json()
}
```

## Testing

### Unit Testing Workflows

```typescript
describe('Order Automation', () => {
  it('should execute workflow successfully', async () => {
    const rule = createTestRule()
    const result = await executeWorkflow(rule)
    expect(result.success).toBe(true)
  })

  it('should update metrics after execution', async () => {
    const initialStats = await fetchStats()
    await executeWorkflow(testRule)
    const updatedStats = await fetchStats()
    expect(updatedStats.executionsToday).toBeGreaterThan(
      initialStats.executionsToday
    )
  })
})
```

## Troubleshooting

### Common Issues

**Workflows not executing**
- Verify rule is enabled
- Check workflow steps are properly configured
- Review error logs in execution status panel

**Slow execution times**
- Check system load and concurrent order count
- Review workflow complexity
- Consider breaking into smaller workflows

**Missing metrics**
- Ensure API endpoint is responding
- Check browser console for fetch errors
- Verify authentication if required

## Future Enhancements

1. **Advanced Analytics**
   - Workflow success patterns
   - Performance optimization suggestions
   - Predictive failure detection

2. **Machine Learning Integration**
   - Auto-optimize workflow parameters
   - Predict optimal execution timing
   - Anomaly detection

3. **Extended Integrations**
   - External system webhooks
   - ERP/CRM synchronization
   - Advanced notification channels

4. **Enhanced UI**
   - Drag-and-drop workflow builder
   - Template library
   - Real-time collaboration

## Support & Contributing

For issues or suggestions:
1. Check the troubleshooting section
2. Review API error responses
3. Check browser console for client-side errors
4. Contact development team with workflow details

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Maintained By**: AddManuChain Development Team
