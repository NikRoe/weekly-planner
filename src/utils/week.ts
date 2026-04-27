const GERMAN_MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

function getMondayOfCurrentWeek(today: Date): Date {
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const daysFromMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + daysFromMonday);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getISOWeekNumber(date: Date): number {
  const thursday = new Date(date);
  thursday.setDate(date.getDate() + (4 - (date.getDay() || 7)));
  const yearStart = new Date(thursday.getFullYear(), 0, 1);
  return Math.ceil(((thursday.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function buildWeekLabel(firstDay: Date, lastDay: Date): string {
  const startMonth = firstDay.getMonth();
  const endMonth = lastDay.getMonth();
  const startYear = firstDay.getFullYear();
  const endYear = lastDay.getFullYear();

  if (startYear !== endYear) {
    return `${firstDay.getDate()} ${GERMAN_MONTHS[startMonth]} ${startYear} – ${lastDay.getDate()} ${GERMAN_MONTHS[endMonth]} ${endYear}`;
  }

  if (startMonth !== endMonth) {
    return `${firstDay.getDate()} ${GERMAN_MONTHS[startMonth]} – ${lastDay.getDate()} ${GERMAN_MONTHS[endMonth]} ${startYear}`;
  }

  return `${firstDay.getDate()} – ${lastDay.getDate()} ${GERMAN_MONTHS[startMonth]} ${startYear}`;
}

export interface WeekData {
  weekDates: number[];
  weekLabel: string;
  weekNumber: number;
  weekYear: number; // ISO week year — year of the Thursday of the week, may differ from calendar year at year boundaries
  todayIndex: number; // 0 = Monday … 6 = Sunday, -1 if today is not in the displayed week
}

export function getWeekData(offset: number = 0): WeekData {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monday = getMondayOfCurrentWeek(today);
  monday.setDate(monday.getDate() + offset * 7);

  const daysOfWeek: Date[] = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + index);
    return day;
  });

  const thursday = new Date(monday);
  thursday.setDate(monday.getDate() + 3);

  const weekDates = daysOfWeek.map((day) => day.getDate());
  const weekLabel = buildWeekLabel(daysOfWeek[0], daysOfWeek[6]);
  const weekNumber = getISOWeekNumber(monday);
  const weekYear = thursday.getFullYear();
  const todayTime = today.getTime();
  const todayIndex = daysOfWeek.findIndex((day) => day.getTime() === todayTime);

  return { weekDates, weekLabel, weekNumber, weekYear, todayIndex };
}
