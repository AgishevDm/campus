export interface RouteStep {
  instruction: string;
  floor?: number;
}

export interface Route {
  path: string[];
  steps: RouteStep[];
  svgPath: string;
}

export interface RoutePoint {
  x: number;
  y: number;
  inCorridor?: boolean;
}