import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AiChallengeService, TrainingScenario } from './ai-challenge.service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import {
  ScenarioResponseDto,
  GenerateScenarioDto,
  PerformanceDto,
} from './dto/scenario.dto';

@ApiTags('AI Security Training')
@Controller('ai-challenge')
export class AiChallengeController {
  constructor(private readonly aiChallengeService: AiChallengeService) {}

  @Post('scenarios/generate')
  @ApiOperation({
    summary: 'Generate a new training scenario',
    description: `Creates a new AI-driven security training scenario based on the floor plan.
    
    The scenario will be generated according to the specified parameters:
    - Floor Plan: Uses the provided floor plan layout for spatial awareness
    - Difficulty: Affects complexity, time limits, and number of objectives
    - Type: Determines the nature of the security threat
    
    The generated scenario includes:
    - Dynamic threat elements with realistic behavior patterns
    - Multiple response options and decision points
    - Time-sensitive objectives and success criteria
    - Real-time environmental factors based on floor plan data`,
  })
  @ApiBody({
    type: GenerateScenarioDto,
    description: 'Floor plan ID and optional scenario parameters',
  })
  @ApiResponse({
    status: 201,
    description: 'The training scenario has been successfully generated',
  })
  async generateScenario(
    @Body('floorPlanId') floorPlanId: string,
  ): Promise<TrainingScenario> {
    return this.aiChallengeService.generateScenario(floorPlanId);
  }

  @Get('scenarios/:id')
  @ApiOperation({
    summary: 'Get an active scenario',
    description: `Retrieves the details of an active training scenario.
    
    Returns comprehensive information about the scenario, including:
    - Current scenario status and progress
    - Active threat elements and their positions
    - Environmental conditions and sensor data
    - Time remaining and current objectives
    - Available response options
    
    This endpoint is typically used for:
    - Initial scenario loading
    - Real-time status updates
    - Scenario state verification
    - Training session resumption`,
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the training scenario',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The training scenario details',
  })
  @ApiResponse({
    status: 404,
    description: 'Scenario not found',
  })
  async getScenario(@Param('id') id: string): Promise<TrainingScenario | null> {
    return this.aiChallengeService.getActiveScenario(id);
  }

  @Post('scenarios/:id/evaluate')
  @ApiOperation({
    summary: 'Evaluate scenario response',
    description: `Evaluates the user response to a training scenario and provides detailed feedback.
    
    The evaluation process considers:
    - Response Time: Speed of action relative to scenario urgency
    - Action Accuracy: Correctness of chosen responses
    - Protocol Adherence: Compliance with security procedures
    - Decision Quality: Effectiveness of chosen actions
    
    Scoring Components:
    - Time-based score (50 points max)
    - Action accuracy (25 points per correct action)
    - Protocol adherence (25 points for following procedures)
    
    The response must include:
    - List of actions taken
    - Time elapsed
    - Optional notes for context`,
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the training scenario',
    required: true,
  })
  @ApiBody({
    type: ScenarioResponseDto,
    description: 'User response to the scenario',
  })
  @ApiResponse({
    status: 200,
    description: 'Response evaluation and feedback',
    schema: {
      properties: {
        score: {
          type: 'number',
          description: 'Score achieved in the scenario (0-100)',
        },
        feedback: {
          type: 'string',
          description: 'Detailed feedback on performance',
        },
      },
    },
  })
  async evaluateResponse(
    @Param('id') id: string,
    @Body() response: ScenarioResponseDto,
  ): Promise<{ score: number; feedback: string }> {
    return this.aiChallengeService.evaluateResponse(id, response);
  }

  @Get('performance/:userId')
  @ApiOperation({
    summary: 'Get user performance history',
    description: `Retrieves the training performance history for a specific user.
    
    The performance history includes:
    - Completed scenarios with timestamps
    - Scores and evaluation metrics
    - Time taken for each scenario
    - Detailed feedback and improvement suggestions
    
    This data is used for:
    - Progress tracking and skill assessment
    - Training program customization
    - Performance trend analysis
    - Identifying areas for improvement
    
    Results are ordered by date, with the most recent scenarios first.`,
  })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'User performance history',
    type: [PerformanceDto],
  })
  async getPerformanceHistory(@Param('userId') userId: string) {
    return this.aiChallengeService.getPerformanceHistory(userId);
  }
}
