"use client";

import * as React from "react";

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface SelectTriggerProps {
  className?: string;
  children: React.ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

const SelectContext = React.createContext<{
  value: string;
  label: string;
  onValueChange: (value: string, label: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  value: "",
  label: "",
  onValueChange: () => {},
  open: false,
  setOpen: () => {},
});

export function Select({ value, onValueChange, children }: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const [label, setLabel] = React.useState("");

  const handleValueChange = React.useCallback((newValue: string, newLabel: string) => {
    setLabel(newLabel);
    onValueChange(newValue);
  }, [onValueChange]);

  return (
    <SelectContext.Provider value={{ value, label, onValueChange: handleValueChange, open, setOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ className = "", children }: SelectTriggerProps) {
  const { open, setOpen } = React.useContext(SelectContext);

  return (
    <button
      type="button"
      className={`flex w-full items-center justify-between rounded-md border bg-white text-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c6af6c] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      onClick={() => setOpen(!open)}
    >
      {children}
      <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

export function SelectValue({ placeholder }: SelectValueProps) {
  const { label } = React.useContext(SelectContext);
  return <span className="text-gray-900">{label || placeholder}</span>;
}

export function SelectContent({ children }: SelectContentProps) {
  const { open } = React.useContext(SelectContext);

  if (!open) return null;

  return (
    <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white text-gray-900 shadow-lg">
      <div className="p-1">{children}</div>
    </div>
  );
}

export function SelectItem({ value, children }: SelectItemProps) {
  const { value: selectedValue, onValueChange, setOpen } = React.useContext(SelectContext);
  const isSelected = selectedValue === value;

  const getTextContent = (node: React.ReactNode): string => {
    if (typeof node === "string") return node;
    if (typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(getTextContent).join("");
    if (React.isValidElement(node)) {
      const props = node.props as { children?: React.ReactNode };
      if (props.children) {
        return getTextContent(props.children);
      }
    }
    return "";
  };

  return (
    <div
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 text-gray-900 ${
        isSelected ? "bg-gray-100 font-medium" : ""
      }`}
      onClick={() => {
        onValueChange(value, getTextContent(children));
        setOpen(false);
      }}
    >
      {children}
    </div>
  );
}
