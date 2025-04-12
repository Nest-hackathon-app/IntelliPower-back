import { mapToFloorPlanData } from 'src/utils/flat.util';
import { sampleFloor } from './data/rack.data';

console.dir(mapToFloorPlanData(sampleFloor),{depth: 10});
