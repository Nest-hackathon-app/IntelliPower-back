# AI Challenge DTOs Documentation

## ScenarioResponseDto
Represents a user's response to a training scenario.

```typescript
{
  id: string;          // Unique identifier of the scenario
  actions: string[];   // List of actions taken during the scenario
  timeElapsed: number; // Time taken to complete (seconds)
  notes?: string;      // Optional additional observations
}
```

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | string | Yes | The unique identifier of the scenario being responded to |
| actions | string[] | Yes | Array of actions taken during the scenario (e.g., ["lockdown", "notify"]) |
| timeElapsed | number | Yes | Time taken to complete the scenario in seconds |
| notes | string | No | Additional notes or observations about the response |

### Valid Actions
- `lockdown`: Initiate facility lockdown
- `notify`: Alert security personnel
- `evacuate`: Order evacuation
- `investigate`: Send security team to investigate
- `monitor`: Increase surveillance
- `isolate`: Isolate affected area

## GenerateScenarioDto
Configuration options for generating a new training scenario.

```typescript
{
  floorPlanId: string;                    // Target floor plan ID
  difficulty?: "easy" | "medium" | "hard"; // Optional difficulty setting
  type?: "intrusion" | "fire" | "cyber" | "employee"; // Optional scenario type
}
```

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| floorPlanId | string | Yes | ID of the floor plan to generate the scenario for |
| difficulty | enum | No | Difficulty level of the scenario |
| type | enum | No | Type of security scenario to generate |

### Difficulty Levels
- `easy`: Basic scenarios for new personnel training
- `medium`: Intermediate scenarios with multiple objectives
- `hard`: Complex scenarios requiring coordination

### Scenario Types
- `intrusion`: Physical security breach scenarios
- `fire`: Emergency response scenarios
- `cyber`: Cybersecurity incident scenarios
- `employee`: Internal threat scenarios

## PerformanceDto
Represents a user's performance record in a training scenario.

```typescript
{
  date: Date;          // Completion timestamp
  scenarioType: string; // Type of scenario
  score: number;       // Achievement score (0-100)
  timeElapsed: number; // Completion time (seconds)
  feedback?: string;   // Optional performance feedback
}
```

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| date | Date | Yes | Date and time when the scenario was completed |
| scenarioType | string | Yes | Type of scenario that was completed |
| score | number | Yes | Score achieved in the scenario (0-100) |
| timeElapsed | number | Yes | Time taken to complete the scenario in seconds |
| feedback | string | No | Detailed feedback on performance |

### Score Ranges
- 0-69: Failed scenario
- 70-84: Passed scenario
- 85-94: Good performance
- 95-100: Excellent performance 