import type { CalendarDay } from "../../types/calendar";
import "./DayPanel.css"

import {AddPurchaseCard} from "../purchase/AddPurchaseCard"
import {PurchaseList} from "../purchase/PurchaseList"

type DayPanelProps = {
    day: CalendarDay;
    // onAddPurchase?: () => void
}

export function DayPanel({ day }: DayPanelProps) {
    const handleAddPurchase = () => {
        console.log("Add purchase clicked");
    };
    return (
        <section className="day-panel">
            <div className="day-panel__content">
                {day.purchases.length === 0 ? (
                    <AddPurchaseCard onAdd={handleAddPurchase}/>
                ) : (
                    <PurchaseList purchases={day.purchases} onAddPurchase={handleAddPurchase}/>
                )}
            </div>
        </section>
    )
}
