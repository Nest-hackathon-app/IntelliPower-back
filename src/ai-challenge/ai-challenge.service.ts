import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';

export interface TrainingScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'intrusion' | 'fire' | 'cyber' | 'employee';
  status: 'active' | 'completed' | 'failed';
  timeLimit: number; // in seconds
  score: number;
  elements: {
    type: string;
    position: { x: number; y: number };
    properties: Record<string, any>;
  }[];
}

@Injectable()
export class AiChallengeService {
  private activeScenarios: Map<string, TrainingScenario> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async generateScenario(floorPlanId: string): Promise<TrainingScenario> {
    // For POC, we'll create a simple intrusion scenario
    const scenario: TrainingScenario = {
      id: `scenario-${Date.now()}`,
      title: 'Unauthorized Access Detection',
      description: 'Detect and respond to unauthorized access in the server room',
      difficulty: 'medium',
      type: 'intrusion',
      status: 'active',
      timeLimit: 300, // 5 minutes
      score: 0,
      elements: [
        {
          type: 'intruder',
          position: { x: 150, y: 150 },
          properties: {
            movementPattern: 'random',
            threatLevel: 'high',
            speed: 1,
          },
        },
        {
          type: 'objective',
          position: { x: 200, y: 200 },
          properties: {
            type: 'secure',
            status: 'vulnerable',
          },
        },
      ],
    };

    this.activeScenarios.set(scenario.id, scenario);
    return scenario;
  }

  async getActiveScenario(scenarioId: string): Promise<TrainingScenario | null> {
    return this.activeScenarios.get(scenarioId) || null;
  }

  async evaluateResponse(
    scenarioId: string,
    response: any,
  ): Promise<{ score: number; feedback: string }> {
    const scenario = this.activeScenarios.get(scenarioId);
    if (!scenario) {
      return { score: 0, feedback: 'Scenario not found' };
    }

    // Simple scoring logic for POC
    let score = 0;
    let feedback = '';

    // Basic response time scoring
    const responseTime = response.timeElapsed || 0;
    if (responseTime < scenario.timeLimit / 2) {
      score += 50;
      feedback += 'Quick response. ';
    } else if (responseTime < scenario.timeLimit) {
      score += 30;
      feedback += 'Acceptable response time. ';
    }

    // Action accuracy scoring
    if (response.actions?.includes('lockdown')) {
      score += 25;
      feedback += 'Correct security protocol followed. ';
    }
    if (response.actions?.includes('notify')) {
      score += 25;
      feedback += 'Good communication protocol. ';
    }

    scenario.score = score;
    scenario.status = score >= 70 ? 'completed' : 'failed';

    return { score, feedback };
  }

  async getPerformanceHistory(userId: string): Promise<any[]> {
    // In a real implementation, this would fetch from the database
    return [
      {
        date: new Date(),
        scenarioType: 'intrusion',
        score: 85,
        timeElapsed: 240,
      },
    ];
  }
}
