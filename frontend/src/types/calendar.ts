export type CalendarPurchase = {
  id: number;
  location: string;
};

export type CalendarDay = {
  date: Date;
  purchases: CalendarPurchase[];
};
