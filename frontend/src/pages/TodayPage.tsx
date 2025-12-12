import { DayHeader } from "../components/day/DayHeader";
import { DayPanel } from "../components/day/DayPanel";
import type { CalendarDay } from "../types/calendar";

const today = new Date();

const mockDay: CalendarDay = {
  date: today,
  purchases: [
    { id: 1, location: "Costco", total: 82.45 },
    { id: 2, location: "HMart", total: 46.1 },
  ],
};

export function TodayPage() {
  const total = mockDay.purchases.reduce(
    (sum, p) => sum + p.total,
    0
  );

  return (
    <>
      <DayHeader
        date={today}
        totalSpent={total}
        purchaseCount={mockDay.purchases.length}
      />
      <DayPanel
        day={mockDay}
      />
    </>
  );
}

export default TodayPage