import { useEffect, useRef } from "react";

type InlineEditProps<T extends string | number = string> = {
  value: T;
  isEditing: boolean;

  placeholder?: string;
  className?: string;

  onStartEditing: () => void;
  onStopEditing: () => void;

  autosave: {
    // exposing just the bind, not other functions
    bind: {
      value: T;
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
      onBlur?: () => void;
      onKeyDown?: (e: React.KeyboardEvent) => void;
    };
  };

  renderDisplay?: (value: T) => React.ReactNode;
  // Core Idea : 
  // Behavior lives in InlineEdit 
  // Appearance lives in the parent via renderDisplay - renderDisplay is kind of like a prop
};


export function InlineEdit<T extends string | number = string>({
  value,
  isEditing,
  placeholder,
  className,
  onStartEditing,
  onStopEditing,
  autosave,
  renderDisplay,
}: InlineEditProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Autofocus when editing starts - onStartEdit sets the editingObj
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        className={className}
        placeholder={placeholder}
        {...autosave.bind}
        onBlur={() => {
          autosave.bind.onBlur?.();
          onStopEditing();
        }}
        onKeyDown={(e) => {
          autosave.bind.onKeyDown?.(e);
          if (e.key === "Enter" || e.key === "Escape") {
            onStopEditing();
          }
        }}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  return (
    <span
      className={className}
      onClick={(e) => {
        e.stopPropagation();
        onStartEditing();
      }}
    >
      {renderDisplay
        ? renderDisplay(value)
        : (value ?? placeholder ?? "") as React.ReactNode}
    </span>
  );
}
