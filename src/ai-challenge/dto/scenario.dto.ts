import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ScenarioResponseDto {
  @ApiProperty({
    description: 'The ID of the scenario being responded to',
    example: 'scenario-1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'List of actions taken in response to the scenario',
    example: ['lockdown', 'notify'],
    isArray: true,
  })
  actions: string[];

  @ApiProperty({
    description: 'Time taken to complete the scenario (in seconds)',
    example: 180,
  })
  timeElapsed: number;

  @ApiPropertyOptional({
    description: 'Additional notes or comments about the response',
    example: 'Suspicious activity detected in server room',
  })
  notes?: string;
}

export class GenerateScenarioDto {
  @ApiProperty({
    description: 'ID of the floor plan to generate the scenario for',
    example: 'floor-plan-123',
  })
  floorPlanId: string;

  @ApiPropertyOptional({
    description: 'Difficulty level of the scenario',
    enum: ['easy', 'medium', 'hard'],
    example: 'medium',
  })
  difficulty?: 'easy' | 'medium' | 'hard';

  @ApiPropertyOptional({
    description: 'Type of security scenario to generate',
    enum: ['intrusion', 'fire', 'cyber', 'employee'],
    example: 'intrusion',
  })
  type?: 'intrusion' | 'fire' | 'cyber' | 'employee';
}

export class PerformanceDto {
  @ApiProperty({
    description: 'Date and time when the scenario was completed',
    example: '2024-03-15T14:30:00Z',
  })
  date: Date;

  @ApiProperty({
    description: 'Type of scenario completed',
    example: 'intrusion',
  })
  scenarioType: string;

  @ApiProperty({
    description: 'Score achieved in the scenario (0-100)',
    example: 85,
    minimum: 0,
    maximum: 100,
  })
  score: number;

  @ApiProperty({
    description: 'Time taken to complete the scenario (in seconds)',
    example: 240,
  })
  timeElapsed: number;

  @ApiPropertyOptional({
    description: 'Detailed feedback on performance',
    example: 'Quick response time. Correct security protocols followed.',
  })
  feedback?: string;
} 