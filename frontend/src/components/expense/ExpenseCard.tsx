import type { ExpenseReadDTO, ExpenseUpdateDTO } from "../../api/expenses";
import { useAutosaveField } from "../../hooks/useAutoSaveField";
import type { EditingTarget } from "../../types/types";
import { InlineEdit } from "../common/InlineEdit";
import { TypeToggle } from "../common/TypeToggle";
import "./ExpenseCard.css";

type ExpenseCardProps = {
  expense: ExpenseReadDTO;
  onDeleteExpense: (id: number) => void;
  onUpdateExpense: (id: number, payload: Partial<ExpenseUpdateDTO>) => void;
  editingObj: EditingTarget;
  setEditingObj: (id: EditingTarget) => void;
};

export function ExpenseCard({
  expense,
  onDeleteExpense,
  onUpdateExpense,
  editingObj,
  setEditingObj,
}: ExpenseCardProps) {
  // Reserved for future inline editing hooks; avoids unused warnings for now.
  void onUpdateExpense;
  void editingObj;
  void setEditingObj;

  const productId = expense.product_id ?? (expense as any).productId;

  // what should be in the expense card ? 
  // 1. be able to create an expense card 
  // 2. be able to update the expense card - what fields ?
  // 3. product name, price, tax, tip, tax kind, tip kind
  //    each of these have to be autosave and inline editable 
  // 4. be able to delete the expense card 
  const isEditingPrice = 
    editingObj?.type === "expense" &&
    editingObj?.expenseId === expense.id &&
    editingObj?.field === "price";
  const isEditingTax = 
    editingObj?.type === "expense" &&
    editingObj?.expenseId === expense.id &&
    editingObj?.field === "tax";
  const isEditingTip = 
    editingObj?.type === "expense" &&
    editingObj?.expenseId === expense.id &&
    editingObj?.field === "tip";
  const isEditingUserLabel = 
    editingObj?.type === "expense" &&
    editingObj?.expenseId === expense.id &&
    editingObj?.field === "user_label";

  const price = useAutosaveField<number>({
    value: expense.price ?? 0,
    onSave: (price) => onUpdateExpense(expense.id, { price }),
    isEditing: isEditingPrice
  });

  const tax = useAutosaveField<number>({
    value: expense.tax_value ?? 0,
    onSave: (tax) => onUpdateExpense(expense.id, { tax_value: tax }),
    isEditing: isEditingTax
  });

  const tip = useAutosaveField<number>({
    value: expense.tip_value ?? 0,
    onSave: (tip) => onUpdateExpense(expense.id, { tip_value: tip }),
    isEditing: isEditingTip
  });

  const user_label = useAutosaveField<string>({
    value: expense.user_label ?? "",
    onSave: (user_label) => onUpdateExpense(expense.id, { user_label }),
    isEditing: isEditingUserLabel
  });

  return (
    <div className="expense-card">
      <div className="expense-card__row">
        <InlineEdit
          value={user_label.draft}
          isEditing={isEditingUserLabel}
          className="expense-card__user-label"
          placeholder="Add label"
          onStartEditing={() => 
            setEditingObj({
              type: "expense",
              expenseId: expense.id,
              field: "user_label"
            })
          }
          onStopEditing={() => setEditingObj(null)}
          autosave={user_label}
          renderDisplay={(val) => <span>{val || <i className="expense-card__placeholder">Add label</i>}</span>}
        />
        <InlineEdit 
          value={price.draft}
          isEditing={isEditingPrice}
          className="expense-card__price"
          placeholder="Price"
          onStartEditing={() => 
            setEditingObj({
              type: "expense",
              expenseId: expense.id,
              field: "price"
            })
          }
          onStopEditing={() => setEditingObj(null)}
          autosave={price}
          renderDisplay={(val) => <>${Number(val ?? 0).toFixed(2)}</>}
        />
        <div className="expense-card__inline-group">
          <InlineEdit
            value={tax.draft}
            isEditing={isEditingTax}
            className="expense-card__number"
            placeholder="Tax"
            onStartEditing={() =>
              setEditingObj({
                type: "expense",
                expenseId: expense.id,
                field: "tax",
              })
            }
            onStopEditing={() => setEditingObj(null)}
            autosave={tax}
            renderDisplay={(val) =>
              val ? <span className="expense-card__pill">Tax: {val}</span> : <span className="expense-card__muted">Add tax</span>
            }
          />
          <TypeToggle
            value={expense.tax_kind ?? "amount"}
            onChange={(next) => onUpdateExpense(expense.id, { tax_kind: next })}
            options={[
              { value: "amount", label: "$" },
              { value: "percent", label: "%" },
            ]}
          />
          <InlineEdit
            value={tip.draft}
            isEditing={isEditingTip}
            className="expense-card__number"
            placeholder="Tip"
            onStartEditing={() =>
              setEditingObj({
                type: "expense",
                expenseId: expense.id,
                field: "tip",
              })
            }
            onStopEditing={() => setEditingObj(null)}
            autosave={tip}
            renderDisplay={(val) =>
              val ? <span className="expense-card__pill">Tip: {val}</span> : <span className="expense-card__muted">Add tip</span>
            }
          />
          <TypeToggle
            value={expense.tip_kind ?? "amount"}
            onChange={(next) => onUpdateExpense(expense.id, { tip_kind: next })}
            options={[
              { value: "amount", label: "$" },
              { value: "percent", label: "%" },
            ]}
          />
        </div>
        <button
          className="expense-card__delete"
          onClick={() => onDeleteExpense(expense.id)}
          aria-label="Delete expense"
        >
          ✕
        </button>
      </div>

      {/* {(taxDisplay || tipDisplay || productId) && (
        <div className="expense-card__meta">
          {taxDisplay ? <span className="expense-card__pill">Tax: {taxDisplay}</span> : null}
          {tipDisplay ? <span className="expense-card__pill">Tip: {tipDisplay}</span> : null}
          {productId ? <span className="expense-card__pill">Product #{productId}</span> : null}
        </div>
      )} */}
    </div>
  );
}
