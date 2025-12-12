import { format } from "date-fns";
import "./DayHeader.css"

type DayHeaderProps = {
  date: Date;
  totalSpent: number;
  purchaseCount: number;
};

export function DayHeader({
    date,
    totalSpent,
    purchaseCount,
}: DayHeaderProps) {
    return (
        <header className="day-header">
            <div className="day-header__left">
                <h1 className="day-header__title">
                    { format(date, "EEEE") }
                </h1>
                <p className="day-header__date">
                    { format(date, "MMMM d, yyyy") }
                </p>
            </div>

            <div className="day-header__stats">
                <div className="day-header__stat">
                    <span className="label">Spent</span>
                    <span className="value">${totalSpent.toFixed(2)}</span>
                </div>
                <div className="day-header__stat">
                    <span className="label">Purchases</span>
                    <span className="value">{purchaseCount}</span>
                </div>
            </div>
        </header>
    )
}