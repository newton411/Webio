export interface BroadcastScript {
  id: string;
  topic: string;
  category: string;
  script: string;
  createdAt: string;
  durationMinutes: number;
  hostTone: string;
}

export interface DaypartBlock {
  hourRange: string;
  slotName: string;
  energyLevel: 'High' | 'Medium' | 'Low' | 'Ambient';
  category: string;
  hostPersona: string;
  description: string;
}

export interface PipelineStep {
  id: number;
  name: string;
  status: 'completed' | 'running' | 'pending' | 'failed';
  details: string;
}
