export interface User {
  name: string;
  datasetNumber: string;
}

export interface Behavior {
  behavior: string;
  feature: string;
  reasoning: string;
  isPositive: boolean;
}

export interface DataPoint {
  pid: number;
  query: string;
  response: string;
  target_sentence: string;
  behaviors: Behavior[];
  expected: string;
  type: string;
  condition: string;
}

export interface EvaluationResult {
  behaviorIndex: number;
  isRelevant: boolean;
}

export interface AdditionalSentence {
  sentence: string;
}

export interface DataPointResult {
  dataPointIndex: number;
  evaluations: EvaluationResult[];
  additionalSentences: AdditionalSentence[];
}

export interface SessionResult {
  user: User;
  datasetNumber: string;
  dataPointResults: DataPointResult[];
  timestamp: Date;
}
