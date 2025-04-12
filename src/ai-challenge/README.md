# AI Security Training Module

This module provides an AI-driven security training system that generates and evaluates dynamic security scenarios based on your facility's floor plan.

## API Endpoints

### 1. Generate Training Scenario
```http
POST /ai-challenge/scenarios/generate
```

Generate a new AI-driven security training scenario.

**Request Body:**
```json
{
  "floorPlanId": "floor-plan-123",
  "difficulty": "medium",
  "type": "intrusion"
}
```

**Response:**
```json
{
  "id": "scenario-1234567890",
  "title": "Unauthorized Access Detection",
  "description": "Detect and respond to unauthorized access in the server room",
  "difficulty": "medium",
  "type": "intrusion",
  "status": "active",
  "timeLimit": 300,
  "score": 0,
  "elements": [...]
}
```

### 2. Get Active Scenario
```http
GET /ai-challenge/scenarios/:id
```

Retrieve details of an active training scenario.

**Response:**
```json
{
  "id": "scenario-1234567890",
  "title": "Unauthorized Access Detection",
  "description": "Detect and respond to unauthorized access in the server room",
  "difficulty": "medium",
  "type": "intrusion",
  "status": "active",
  "timeLimit": 300,
  "score": 0,
  "elements": [...]
}
```

### 3. Evaluate Scenario Response
```http
POST /ai-challenge/scenarios/:id/evaluate
```

Submit and evaluate a response to a training scenario.

**Request Body:**
```json
{
  "id": "scenario-1234567890",
  "actions": ["lockdown", "notify"],
  "timeElapsed": 180,
  "notes": "Suspicious activity detected in server room"
}
```

**Response:**
```json
{
  "score": 85,
  "feedback": "Quick response. Correct security protocol followed."
}
```

### 4. Get Performance History
```http
GET /ai-challenge/performance/:userId
```

Retrieve training performance history for a specific user.

**Response:**
```json
[
  {
    "date": "2024-03-15T14:30:00Z",
    "scenarioType": "intrusion",
    "score": 85,
    "timeElapsed": 240,
    "feedback": "Quick response time. Correct security protocols followed."
  }
]
```

## Scenario Types

- **Intrusion**: Physical security breach scenarios
- **Fire**: Emergency response scenarios
- **Cyber**: Cybersecurity incident scenarios
- **Employee**: Internal threat scenarios

## Difficulty Levels

- **Easy**: Basic scenarios for training new personnel
- **Medium**: Intermediate scenarios with multiple objectives
- **Hard**: Complex scenarios requiring quick thinking and coordination

## Scoring System

Scores are calculated based on:
- Response time (50 points max)
- Action accuracy (25 points per correct action)
- Protocol adherence (25 points for following procedures)

A score of 70 or higher is required to pass a scenario.

## Integration Example

```typescript
// Generate a new scenario
const scenario = await aiChallengeService.generateScenario('floor-plan-123');

// Submit a response
const evaluation = await aiChallengeService.evaluateResponse(scenario.id, {
  actions: ['lockdown', 'notify'],
  timeElapsed: 180,
  notes: 'Suspicious activity detected'
});

// Get performance history
const history = await aiChallengeService.getPerformanceHistory('user-123');
``` 