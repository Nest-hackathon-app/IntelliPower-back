// BE Types (Prisma Schema)
export interface Temperature {
  id: string;
  sensorId: string;
  temp: number;
  humidity: number;
  createdAt: string;
}

export interface Sensor {
  id: string;
  name: string;
  areaId: string;
  rackId: string | null;
  locationX: number;
  locationY: number;
  type: 'TEMPERATURE' | 'ELECTRICITY' | 'FAN';
  Temperature: Temperature[];
}

export interface Anomaly {
  id: string;
  areaId: string;
  rackId: string | null;
  title: string;
  status: 'active' | 'resolved';
  reportedAt: string;
  resolvedAt: string | null;
}

export interface Rack {
  id: string;
  name: string;
  dataCenterId: string;
  areaId: string;
  locationX: number;
  locationY: number;
  locationZ: number;
  lastMaintenance: string | null;
  sensors: Sensor[];
  anomalies: Anomaly[];
}

export interface Camera {
  id: string;
  name: string;
  floorId: string;
  locationX: number;
  locationY: number;
  areaId: string;
}

export interface Area {
  id: string;
  name: string;
  floorId: string;
  dataCenterId: string | null;
  type: 'server_room' | 'call_center' | 'office' | 'hallway' | 'restricted';
  polygon: { x: number; y: number }[];
  capacity: number;
  racks: Rack[];
  cameras: Camera[];
}

export interface Floor{
  id: string;
  name: string;
  order: number;
  companyId: string;
  areas: Area[];
}

// FE Types (FloorPlanData)
export interface Point {
  x: number;
  y: number;
}

export interface Wall {
  start: Point;
  end: Point;
  thickness: number;
}

export interface CameraFE {
  position: Point;
  direction: number;
  fieldOfView: number;
  range: number;
  isActive: boolean;
}

export interface RackFE {
  id: string;
  name: string;
  position: Point;
  width: number;
  height: number;
  rotation: number;
  temperature: number;
  fanStatus: 'normal' | 'warning' | 'critical';
  needsMaintenance: boolean;
}

export interface FloorPlanData {
  id: string;
  name: string;
  description?: string;
  lastUpdated: string;
  dimensions: {
    width: number;
    height: number;
  };
  walls: Wall[];
  doors?: never[]; // Empty for now
  windows?: never[];
  furniture?: never[];
  cameras?: CameraFE[];
  racks?: RackFE[];
}
