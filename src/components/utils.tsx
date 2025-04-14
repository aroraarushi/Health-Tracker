import { HealthEntry } from './types.tsx';

export const convertGlassToLiters = (glasses: string): string => 
  (Number(glasses) * 0.25).toFixed(2);

export const getDayPeriod = (timestamp: string): string => {
  const hour = new Date(timestamp).getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

export const exportToCsv = (entries: HealthEntry[]): void => {
  if (entries.length === 0) return;

  const headers = ['Timestamp', 'Steps', 'Water (Liters)', 'Heart Rate'];
  const rows = entries.map(entry => [
    entry.timestamp,
    entry.steps ?? '',
    entry.water ?? '',
    entry.heartRate ?? ''
  ]);

  const csvContent =
    [headers, ...rows]
      .map(e => e.map(cell => `"${cell}"`).join(','))
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'health_data.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 


export const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 16); 
  };


