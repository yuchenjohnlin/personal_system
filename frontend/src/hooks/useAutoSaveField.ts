// src/hooks/useAutosaveField.ts
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash-es";

type UseAutosaveFieldOptions<T> = {
  value: T;
  onSave: (value: T) => void | Promise<void>;
  isEditing?: boolean;
  debounceMs?: number;
};

export function useAutosaveField<T>({
  value,
  onSave,
  isEditing = true,
  debounceMs = 400,
}: UseAutosaveFieldOptions<T>) {
  const [draft, setDraft] = useState<T>(value);

  // debounce save to avoid spamming API
  // Create debounced save ONCE
  const debouncedSaveRef = useRef(
    debounce((v: T) => {
      onSave(v);
    }, debounceMs)
  );

  const debouncedSave = debouncedSaveRef.current;

  useEffect(() => {
    if (!isEditing) setDraft(value);
  }, [value]);

  /**
   * 2. Trigger debounced save when draft changes
   *    but only if editing is active
   */
  useEffect(() => {
    if (!isEditing) return; // I think this is a double check ? because there will only be one being edited ? 
    debouncedSave(draft);
    return () => {
      debouncedSave.cancel();
    };
  }, [draft, isEditing, debouncedSave]);

  /**
   * 3. Immediate save helpers
   * API boundary design.
   * clarity, safety, and reuse, not technical necessity.
   */
  const flush = () => {
    debouncedSave.flush();
  };

  const cancel = () => {
    debouncedSave.cancel();
    setDraft(value);
  };

  /**
   * 4. Input bindings (optional convenience)
   */
  const bind = {
    value: draft as any,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setDraft(e.target.value as any);
    },
    onBlur: () => {
      flush();
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        flush();
      }
      if (e.key === "Escape") {
        cancel();
      }
    },
  };

  return {
    draft,
    setDraft,
    flush,
    cancel,
    bind,
  };
}
