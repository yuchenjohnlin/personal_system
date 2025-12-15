import { useEffect, useState } from "react";
import "./AddPurchaseModal.css";
import type { PurchaseCreateDTO } from "../../api/purchases";

type AddPurchaseModalProps = {
  isOpen: boolean;
  defaultDate: string;
  onCreate: (payload: PurchaseCreateDTO) => void;
  onClose: () => void;
};

export function AddPurchaseModal({
  isOpen,
  defaultDate,
  onCreate,
  onClose,
}: AddPurchaseModalProps) {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(defaultDate);

  useEffect(() => {
    setDate(defaultDate);
  }, [defaultDate]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h2 className="modal__title">Add Purchase</h2>
        <label className="modal__field">
          <span className="modal__label">Location</span>
          <input
            className="modal__input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Store name"
            autoFocus
          />
        </label>
        <label className="modal__field">
          <span className="modal__label">Date</span>
          <input
            className="modal__input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <div className="modal__actions">
          <button className="modal__button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="modal__button modal__button--primary"
            onClick={() => {
              onCreate({
                purchased_at: date,
                location: location.trim() || undefined,
              });
              setLocation("");
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
