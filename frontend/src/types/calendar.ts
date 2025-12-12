export type Purchase = {
    id: number;
    location: string;
    total: number;
}

export type CalendarDay = {
    date: Date;
    purchases: Purchase[];
}