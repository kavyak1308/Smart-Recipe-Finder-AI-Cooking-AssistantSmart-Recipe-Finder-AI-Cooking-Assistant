"use client";

import { useState, FormEvent } from "react";
import { X, Trash2, Check, Plus, ShoppingBag } from "lucide-react";
import { ShoppingListItem } from "@/types/recipe";

interface ShoppingListDrawerProps {
  isOpen: boolean;
  items: ShoppingListItem[];
  onClose: () => void;
  onToggleItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onAddCustomItem: (name: string, amount: string) => void;
  onClearChecked: () => void;
  onClearAll: () => void;
}

export default function ShoppingListDrawer({
  isOpen,
  items,
  onClose,
  onToggleItem,
  onRemoveItem,
  onAddCustomItem,
  onClearChecked,
  onClearAll,
}: ShoppingListDrawerProps) {
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");

  if (!isOpen) return null;

  const checkedCount = items.filter((item) => item.checked).length;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    onAddCustomItem(trimmed, newAmount.trim() || "1 unit");
    setNewName("");
    setNewAmount("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#1B261E]/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping List"
      onClick={onClose}
    >
      <aside
        className="w-full max-w-md h-full bg-[#F8F6F1] border-l border-[#E2DDD3] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-5 bg-white border-b border-[#E2DDD3]">
          <div>
            <h2 className="font-display text-xl font-semibold text-[#1B261E]">
              Shopping List
            </h2>
            <p className="text-xs text-[#556358] tabular-nums mt-0.5">
              {items.length} {items.length === 1 ? "item" : "items"} ·{" "}
              {checkedCount} picked up
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shopping list"
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#E2DDD3] bg-[#F8F6F1] text-[#1B261E] hover:bg-[#F1EDE4] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Add Custom Item Form */}
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-white border-b border-[#E2DDD3] flex flex-col sm:flex-row gap-2"
        >
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Add grocery item..."
            aria-label="Grocery item name"
            className="flex-1 px-3.5 py-2.5 text-sm bg-[#F8F6F1] border border-[#E2DDD3] rounded-lg text-[#1B261E] placeholder:text-[#556358]/70 focus:outline-none focus:border-[#2D5A3D]"
          />
          <input
            type="text"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            placeholder="Qty"
            aria-label="Quantity"
            className="sm:w-24 px-3 py-2.5 text-sm bg-[#F8F6F1] border border-[#E2DDD3] rounded-lg text-[#1B261E] placeholder:text-[#556358]/70 focus:outline-none focus:border-[#2D5A3D]"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-[#2D5A3D] hover:bg-[#22462F] rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Add</span>
          </button>
        </form>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 px-6">
              <div className="w-12 h-12 rounded-xl bg-[#EEF3EC] text-[#2D5A3D] flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg font-semibold text-[#1B261E] mb-1">
                Your list is empty
              </h3>
              <p className="text-sm text-[#556358] max-w-xs leading-relaxed">
                Missing ingredients from any recipe or alternative suggestion can
                be added here with one click.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {items.map((item) => (
                <li
                  key={item.id}
                  className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-colors ${
                    item.checked
                      ? "bg-[#EEF3EC]/60 border-[#2D5A3D]/25"
                      : "bg-white border-[#E2DDD3]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onToggleItem(item.id)}
                    className="flex items-start gap-3 flex-1 text-left cursor-pointer"
                  >
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 rounded border mt-0.5 shrink-0 transition-colors ${
                        item.checked
                          ? "bg-[#2D5A3D] border-[#2D5A3D] text-white"
                          : "bg-white border-[#C8C1B4]"
                      }`}
                    >
                      {item.checked && (
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <div
                        className={`text-sm font-medium ${
                          item.checked
                            ? "line-through text-[#556358]"
                            : "text-[#1B261E]"
                        }`}
                      >
                        {item.name}
                      </div>
                      <div className="text-xs text-[#556358] tabular-nums">
                        {item.amount}
                        {item.recipeTitle && (
                          <span> · For {item.recipeTitle}</span>
                        )}
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    aria-label={`Remove ${item.name} from shopping list`}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[#556358] hover:text-[#9B2C2C] hover:bg-[#F1EDE4] transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="p-4 bg-white border-t border-[#E2DDD3] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClearChecked}
              disabled={checkedCount === 0}
              className="px-3.5 py-2 text-xs font-semibold text-[#1B261E] bg-[#F1EDE4] hover:bg-[#E6E0D3] disabled:opacity-45 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              Clear Picked Up ({checkedCount})
            </button>

            <button
              type="button"
              onClick={onClearAll}
              className="px-3.5 py-2 text-xs font-semibold text-[#9B2C2C] hover:bg-[#FDECEC] rounded-lg transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
