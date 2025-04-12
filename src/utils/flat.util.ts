import { CameraFE, Floor, FloorPlanData, RackFE, Wall } from './types/racks';

export function mapToFloorPlanData(floor: Floor): FloorPlanData {
  const walls: Wall[] = [];
  const cameras: CameraFE[] = [];
  const racks: RackFE[] = [];

  // Process each area
  for (const area of floor.areas) {
    // Convert polygon to walls
    const polygon = area.polygon || [];
    for (let i = 0; i < polygon.length; i++) {
      const start = polygon[i];
      const end = polygon[(i + 1) % polygon.length]; // Loop back to first point
      walls.push({
        start: { x: start.x, y: start.y },
        end: { x: end.x, y: end.y },
        thickness: 0.2, // Default thickness
      });
    }

    // Map cameras
    cameras.push(
      ...area.cameras.map((cam) => ({
        position: { x: cam.locationX, y: cam.locationY },
        direction: 90, // Default; extend BE schema if needed
        fieldOfView: 60, // Default
        range: 10, // Default
        isActive: true, // Default
      })),
    );

    // Map racks
    racks.push(
      ...area.racks.map((rack) => {
        // Find temperature sensor
        const tempSensor = rack.sensors.find((s) => s.type === 'TEMPERATURE');
        const temperature = tempSensor?.Temperature[0]?.temp ?? 0;

        // Determine fanStatus from anomalies
        let fanStatus: 'normal' | 'warning' | 'critical' = 'normal';
        const fanAnomaly = rack.anomalies.find((a) => a.title.includes('Fan'));
        if (fanAnomaly) {
          fanStatus = fanAnomaly.title.includes('Failure')
            ? 'critical'
            : 'warning';
        }

        // Check maintenance need
        const needsMaintenance = rack.anomalies.some((a) =>
          a.title.includes('Maintenance'),
        );

        return {
          id: rack.id,
          name: rack.name,
          position: { x: rack.locationX, y: rack.locationZ }, // Use locationZ for y (2D map)
          width: 0.6, // Standard rack width (meters)
          height: 2, // Standard rack height
          rotation: 0, // Default
          temperature,
          fanStatus,
          needsMaintenance,
        };
      }),
    );
  }

  // Compute dimensions (bounding box of all polygons)
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const wall of walls) {
    minX = Math.min(minX, wall.start.x, wall.end.x);
    minY = Math.min(minY, wall.start.y, wall.end.y);
    maxX = Math.max(maxX, wall.start.x, wall.end.x);
    maxY = Math.max(maxY, wall.start.y, wall.end.y);
  }
  const width = maxX - minX;
  const height = maxY - minY;

  return {
    id: floor.id,
    name: floor.name,
    description: floor.name,
    lastUpdated: new Date().toISOString(), // Use floor.updatedAt if available
    dimensions: {
      width: 10, // Fallback
      height: 5, // Fallback
    },
    walls,
    doors: [],
    windows: [],
    furniture: [],
    cameras,
    racks,
  };
}
