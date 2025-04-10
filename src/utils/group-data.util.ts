import { GROUPBY } from 'src/temperature/dto/get-temperature.dto';
import { GroupedData } from 'src/temperature/temperature.service';
//TODO: fix return type and talk to the ML team to get the prediction
export class WithcreatedAt {
  createdAt: Date;
}

export function groupByDate<T extends WithcreatedAt>(
  temperature: T[],
  groupBy: GROUPBY,
  column: string,
) {
  const grouped = temperature.reduce<Record<string, GroupedData<T>>>(
    (acc, curr) => {
      const date = new Date(curr.createdAt);
      let key: string;
      switch (groupBy) {
        case 'day':
          key = date.toISOString().split('T')[0];
          break;
        case 'week': {
          const weekStart = new Date(
            date.setDate(date.getDate() - date.getDay()),
          );
          key = weekStart.toISOString().split('T')[0];
          break;
        }
        case 'month': {
          const month = new Date(date.getFullYear(), date.getMonth(), 1);
          key = month.toISOString().split('T')[0];
          break;
        }
        default:
          key = '';
      }

      if (!acc[key]) {
        acc[key] = { content: [], sum: 0, count: 0 };
      }

      // Accumulate sum and count
      acc[key].content.push(curr);
      acc[key].sum += curr[column];
      acc[key].count++;

      return acc;
    },
    {}, // Initialize as an empty object
  );

  // Now calculate the averages for each group and return
  const result = Object.keys(grouped).map((key) => {
    const group = grouped[key];
    const average = group.sum / group.count;
    return { key, average, content: group.content };
  });
  //TODO:get prediction from the ML model
  const predictedRes = result;
  return { actualRes: result, predicted: predictedRes };
}
