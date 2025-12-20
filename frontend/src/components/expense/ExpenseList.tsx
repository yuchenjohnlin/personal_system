import { ExpenseCard } from "../expense/ExpenseCard";
import type { ExpenseReadDTO, ExpenseCreateDTO, ExpenseUpdateDTO } from "../../api/expenses";
import type { EditingTarget } from "../../types/types";
import { AddExpenseCard } from "./AddExpenseCard";
import "./ExpenseList.css";

export function ExpenseList({
    expenses,
    onAddExpense,
    onDeleteExpense,
    onUpdateExpense,
    editingObj,
    setEditingObj,

} : {
  expenses: ExpenseReadDTO[],
  onAddExpense?: () => void;
  onDeleteExpense?: (id: number) => void;
  onUpdateExpense?: (id: number, payload: Partial<ExpenseUpdateDTO>) => void;
  editingObj: EditingTarget;
  setEditingObj: (id: EditingTarget) => void;
}) {
    return (
      <div className="expense-list">
        <div className="expense-list__header">
          <span>Expense</span>
        </div>
        {expenses?.length === 0 ? (
            <div className="purchase-card__empty">No expenses yet</div>
          ) : (
            <div className="expense-list__rows">
              {expenses.map((exp: any) => (
                <ExpenseCard
                  key={exp.id}
                  expense={exp}
                  onDeleteExpense={onDeleteExpense ?? (() => {})}
                  onUpdateExpense={onUpdateExpense ?? (() => {})}
                  editingObj={editingObj}
                  setEditingObj={setEditingObj}
                />
              ))}
            </div>
        )}
        {onAddExpense ? (
          <AddExpenseCard onAdd={onAddExpense} disabled={editingObj !== null}/>
        ) : null}
      </div>
    )
}
