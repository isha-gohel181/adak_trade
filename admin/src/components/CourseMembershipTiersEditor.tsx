import React from "react";
import { Plus, Trash2, Tag } from "lucide-react";

export interface CourseMembershipTier {
  _id?: string;
  name: string;
  tagline?: string;
  description?: string;
  price: number | string;
  salePrice: number | string;
  currency: string;
  duration: number | string;
  durationType: string;
  benefits: string;
  status: string;
}

const emptyTier: CourseMembershipTier = {
  name: "",
  tagline: "",
  description: "",
  price: "",
  salePrice: "",
  currency: "INR",
  duration: "",
  durationType: "month",
  benefits: "",
  status: "active",
};

interface Props {
  value: CourseMembershipTier[];
  onChange: (tiers: CourseMembershipTier[]) => void;
}

const inputClass =
  "w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";
const labelClass = "block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1";

const CourseMembershipTiersEditor: React.FC<Props> = ({ value, onChange }) => {
  const tiers = value || [];

  const updateTier = (index: number, field: keyof CourseMembershipTier, fieldValue: string) => {
    const next = tiers.map((tier, i) => (i === index ? { ...tier, [field]: fieldValue } : tier));
    onChange(next);
  };

  const addTier = () => onChange([...tiers, { ...emptyTier }]);

  const removeTier = (index: number) => onChange(tiers.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      {tiers.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No membership tiers yet. Add tiers to offer different rates for this course.
        </p>
      )}

      {tiers.map((tier, index) => (
        <div
          key={tier._id || index}
          className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              <Tag className="w-4 h-4 text-brand-500" />
              Tier {index + 1}
            </div>
            <button
              type="button"
              onClick={() => removeTier(index)}
              className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-500/10"
              title="Remove tier"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Name *</label>
              <input
                type="text"
                value={tier.name}
                onChange={(e) => updateTier(index, "name", e.target.value)}
                placeholder="e.g. Gold Membership"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Tagline</label>
              <input
                type="text"
                value={tier.tagline || ""}
                onChange={(e) => updateTier(index, "tagline", e.target.value)}
                placeholder="Short tagline"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Price *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={tier.price}
                onChange={(e) => updateTier(index, "price", e.target.value)}
                placeholder="1999"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Sale Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={tier.salePrice}
                onChange={(e) => updateTier(index, "salePrice", e.target.value)}
                placeholder="999"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Currency</label>
              <input
                type="text"
                value={tier.currency}
                onChange={(e) => updateTier(index, "currency", e.target.value)}
                placeholder="INR"
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Duration</label>
                <input
                  type="number"
                  min="0"
                  value={tier.duration}
                  onChange={(e) => updateTier(index, "duration", e.target.value)}
                  placeholder="1"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Period</label>
                <select
                  value={tier.durationType}
                  onChange={(e) => updateTier(index, "durationType", e.target.value)}
                  className={inputClass}
                >
                  <option value="day">Day</option>
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                  <option value="lifetime">Lifetime</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select
                value={tier.status}
                onChange={(e) => updateTier(index, "status", e.target.value)}
                className={inputClass}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Benefits <span className="text-gray-400 font-normal">(comma separated)</span>
            </label>
            <input
              type="text"
              value={tier.benefits}
              onChange={(e) => updateTier(index, "benefits", e.target.value)}
              placeholder="Unlimited course access, Downloadable resources"
              className={inputClass}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addTier}
        className="inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-brand-500 hover:text-brand-500"
      >
        <Plus className="w-4 h-4" />
        Add Membership Tier
      </button>
    </div>
  );
};

export default CourseMembershipTiersEditor;
