import "./AddExpenseCard.css"

export function AddExpenseCard({
    onAdd, 
    disabled,
}:{
    onAdd: () => void;
    disabled?: boolean;
}) {
    return (
        <button className="add-expense" onClick={onAdd} disabled={disabled}>
        + Add Expense
        </button>
    )
}