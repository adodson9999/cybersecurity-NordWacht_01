"use client";

import { useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Clock, DollarSign, TrendingUp } from "lucide-react";

// ─── Constants ───────────────────────────────────────────
const WEEKS_PER_YEAR = 52;
const HOURLY_RATE = 65;
const STANDARD_WEEK = 40;

// ─── Animated Number Display ─────────────────────────────
function AnimatedValue({
  value,
  formatter,
}: {
  value: number;
  formatter: (n: number) => string;
}) {
  const spring = useSpring(value, { stiffness: 80, damping: 20 });
  const display = useTransform(spring, (latest) =>
    formatter(Math.round(latest))
  );

  // Update the spring target whenever value changes
  spring.set(value);

  return <motion.span>{display}</motion.span>;
}

// ─── Slider Input ────────────────────────────────────────
function RangeSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  id,
  unit,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  id: string;
  unit?: string;
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-[#A1A1A1]">
          {label}
        </label>
        <span className="text-lg font-bold text-white tabular-nums">
          {value}
          {unit && <span className="ml-1 text-sm text-[#A1A1A1]">{unit}</span>}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="roi-slider w-full cursor-pointer"
        style={
          {
            "--slider-progress": `${percentage}%`,
          } as React.CSSProperties
        }
      />
      <div className="flex justify-between text-xs text-[#A1A1A1]/60">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

// ─── Output Card ─────────────────────────────────────────
function OutputCard({
  icon: Icon,
  label,
  value,
  formatter,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  formatter: (n: number) => string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-300 hover:border-[#50C878]/30 hover:bg-white/[0.05] hover:shadow-lg hover:shadow-[#50C878]/5">
      {/* Emerald left accent bar */}
      <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[#50C878] to-[#50C878]/40" />

      <div className="flex items-center gap-4 pl-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#50C878]/10">
          <Icon className="h-5 w-5 text-[#50C878]" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-[#A1A1A1]">
            {label}
          </p>
          <p
            className="mt-1 truncate text-2xl font-extrabold text-white sm:text-3xl"
            aria-live="polite"
          >
            <AnimatedValue value={value} formatter={formatter} />
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Formatters ──────────────────────────────────────────
const formatHours = (n: number) => n.toLocaleString("en-US") + " hrs";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const formatPercent = (n: number) => n.toFixed(1) + "%";

// ─── Main Component (Calculator Body Only) ───────────────
export function ROICalculator() {
  const [teamSize, setTeamSize] = useState(20);
  const [manualHours, setManualHours] = useState(8);

  // Derived values
  const hoursReclaimed = teamSize * manualHours * WEEKS_PER_YEAR;
  const scaledImpact = hoursReclaimed * HOURLY_RATE;
  const efficiencyGain = (manualHours / STANDARD_WEEK) * 100;

  return (
    <div className="space-y-8">
      {/* Two-column grid */}
      <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
        {/* ── Left Column: Inputs ── */}
        <div className="space-y-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm sm:p-6">
          <div>
            <h3 className="mb-1 text-lg font-semibold text-white">
              Configure Your Team
            </h3>
            <p className="text-sm text-[#A1A1A1]">
              Adjust the sliders to match your organization.
            </p>
          </div>

          <RangeSlider
            id="roi-team-size"
            label="Team Size"
            value={teamSize}
            min={1}
            max={100}
            step={1}
            onChange={setTeamSize}
            unit="people"
          />

          <RangeSlider
            id="roi-manual-hours"
            label="Manual Hours / Person / Week"
            value={manualHours}
            min={1}
            max={40}
            step={1}
            onChange={setManualHours}
            unit="hrs"
          />

          {/* Contextual note */}
          <div className="rounded-lg bg-[#50C878]/[0.06] px-4 py-3 text-xs leading-relaxed text-[#A1A1A1]">
            <strong className="text-[#50C878]">Assumptions:</strong> 52 weeks /
            year, $65 / hour blended rate.
          </div>
        </div>

        {/* ── Right Column: Output Cards ── */}
        <div className="space-y-4" aria-live="polite" aria-atomic="true">
          <OutputCard
            icon={Clock}
            label="Hours Reclaimed / Year"
            value={hoursReclaimed}
            formatter={formatHours}
          />
          <OutputCard
            icon={DollarSign}
            label="Scaled Impact Value"
            value={scaledImpact}
            formatter={formatCurrency}
          />
          <OutputCard
            icon={TrendingUp}
            label="Efficiency Gain"
            value={efficiencyGain}
            formatter={formatPercent}
          />
        </div>
      </div>
    </div>
  );
}
