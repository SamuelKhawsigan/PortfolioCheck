"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

/**
 * A pill-based tag input.
 * Type a value and press Enter or comma to add a tag.
 * Click the × on any pill to remove it.
 */
export default function TagInput({ value, onChange, placeholder = "Type and press Enter..." }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (raw: string) => {
    const tag = raw.trim().replace(/,$/, "").trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      // Remove last tag on backspace when input is empty
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "6px",
        padding: "8px 10px",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid var(--card-border)",
        borderRadius: "8px",
        cursor: "text",
        minHeight: "42px",
        alignItems: "center",
      }}
      onClick={(e) => (e.currentTarget.querySelector("input") as HTMLInputElement)?.focus()}
    >
      {/* Existing tags */}
      {value.map((tag, i) => (
        <span key={i} className="tag-pill">
          {tag}
          <button
            type="button"
            onClick={() => removeTag(i)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 0, lineHeight: 1 }}
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {/* Text input */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (inputValue.trim()) addTag(inputValue); }}
        placeholder={value.length === 0 ? placeholder : ""}
        style={{
          background: "none",
          border: "none",
          outline: "none",
          color: "var(--foreground)",
          font: "inherit",
          fontSize: "0.9rem",
          flex: 1,
          minWidth: "120px",
        }}
      />
    </div>
  );
}
