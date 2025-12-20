// src/hooks/useAutosaveField.ts
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash-es";

type UseAutosaveFieldOptions<T> = {
  value: T;
  onSave: (value: T) => void | Promise<void>;
  parse?: (draft: string) => T | null;
  format?: (value: T) => string;
  isEditing?: boolean;
  debounceMs?: number;
};

export function useAutosaveField<T>({
  value,
  onSave,
  parse = (s) => s as unknown as T, // convert what user typed into a valid domain value or reject it
  format = (v) => String(v), // converts the value to something the user can see and edit
  isEditing = true,
  debounceMs = 400,
}: UseAutosaveFieldOptions<T>) {
  const [draft, setDraft] = useState<string>(format(value));

  // debounce save to avoid spamming API
  // Create debounced save ONCE
  const debouncedSave = useRef(
    debounce((nextDraft: string) => {
      const parsed = parse(nextDraft);
      if (parsed !== null) {
        onSave(parsed);
      }
    }, debounceMs)
  ).current;


  useEffect(() => {
    if (!isEditing) setDraft(format(value));
  }, [value, isEditing, format]);

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
    setDraft(format(value));
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


export function useNumericAutosave({
  value,
  onSave,
  isEditing = true,
  decimals = 2,
}: {
  value: number | null | string | undefined;
  onSave: (n: number | null) => void; // null can be in the database
  isEditing?: boolean;
  decimals?: number;
}) {

  const normalizedValue = (() => {
    if (value === null || value === undefined || value === "") return null;
    const n = Number(value);
    return Number.isNaN(n) ? null : n;
  })();

  return useAutosaveField<number | null>({
    value: normalizedValue,
    onSave,
    parse: (s) => {
      if (s.trim() === "") return null;

      const n = Number(s);
      if (Number.isNaN(n)) return null;

      return n;
    },
    format: (n) => {
      if (n === null || Number.isNaN(Number(n))) return "";
      return Number(n).toFixed(decimals);
    },
    isEditing,
  });
}
