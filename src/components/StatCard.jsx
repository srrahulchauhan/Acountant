import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';

// Smooth counting effect for numeric values with live flash
const LiveAnimatedCounter = ({ value, prefix = '₹', duration = 900, isMasked = false }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const prevValueRef = useRef(0);

  useEffect(() => {
    if (isMasked) return;
    const target = Number(value) || 0;
    const start = prevValueRef.current || 0;

    setIsUpdating(true);
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(start + (target - start) * ease);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(target);
        prevValueRef.current = target;
        setTimeout(() => setIsUpdating(false), 300);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [value, duration, isMasked]);

  if (isMasked) {
    return <span className="tracking-widest">••••••••</span>;
  }

  return (
    <span
      className={`inline-block transition-colors duration-300 ${
        isUpdating ? 'text-amber-500 dark:text-amber-300' : ''
      }`}
    >
      <span className="mr-0.5 opacity-90">{prefix}</span>
      {displayValue.toLocaleString('en-IN')}
    </span>
  );
};

// 📈 Live SVG Sparkline with pulsing beacon tip
const LiveSparkline = ({ data = [20, 35, 28, 48, 38, 62, 54, 75], strokeColor = '#F59E0B' }) => {
  const width = 110;
  const height = 28;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(' ');

  const lastX = width;
  const lastY = height - ((data[data.length - 1] - min) / range) * (height - 8) - 4;

  return (
    <div className="relative w-[110px] h-[28px] overflow-visible select-none">
      <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={`grad-${strokeColor.replace('#', '')}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="1" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke={`url(#grad-${strokeColor.replace('#', '')})`}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        {/* Pulsing Beacon Dot at the current live tip */}
        <circle cx={lastX} cy={lastY} r="3" fill={strokeColor} />
        <circle
          cx={lastX}
          cy={lastY}
          r="6"
          fill={strokeColor}
          opacity="0.6"
          className="animate-ping"
        />
      </svg>
    </div>
  );
};

export const StatCard = ({
  title,
  value,
  subtext,
  change,
  isPositive,
  icon: Icon,
  color = 'yellow', // 'yellow' | 'pink' | 'sky' | 'red' | 'green' | 'purple'
  progress = null, // 0 to 100
  progressLabel,
  badgeText,
  sparklineData,
  onClick,
}) => {
  const { currency, isMasked } = useApp();

  // Color theme configurations
  const colorThemes = {
    yellow: {
      border: 'hover:border-amber-400/60 dark:hover:border-amber-400/50',
      glow: 'hover:shadow-glow-yellow',
      iconBg: 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20',
      badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
      progressFill: 'bg-gradient-to-r from-amber-400 to-amber-500',
      accentGlow: 'from-amber-400/12 to-transparent',
      beamClass: 'live-card-beam',
      hex: '#F59E0B',
    },
    pink: {
      border: 'hover:border-pink-400/60 dark:hover:border-pink-400/50',
      glow: 'hover:shadow-glow-pink',
      iconBg: 'bg-pink-500/10 text-pink-500 dark:text-pink-400 border border-pink-500/20',
      badge: 'bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-500/20',
      progressFill: 'bg-gradient-to-r from-pink-400 to-rose-500',
      accentGlow: 'from-pink-400/12 to-transparent',
      beamClass: 'live-card-beam-pink',
      hex: '#EC4899',
    },
    sky: {
      border: 'hover:border-sky-400/60 dark:hover:border-sky-400/50',
      glow: 'hover:shadow-glow-sky',
      iconBg: 'bg-sky-500/10 text-sky-500 dark:text-sky-400 border border-sky-500/20',
      badge: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20',
      progressFill: 'bg-gradient-to-r from-sky-400 to-blue-500',
      accentGlow: 'from-sky-400/12 to-transparent',
      beamClass: 'live-card-beam-sky',
      hex: '#0284C7',
    },
    purple: {
      border: 'hover:border-purple-400/60 dark:hover:border-purple-400/50',
      glow: 'hover:shadow-glow-purple',
      iconBg: 'bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/20',
      badge: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
      progressFill: 'bg-gradient-to-r from-purple-400 to-indigo-500',
      accentGlow: 'from-purple-400/12 to-transparent',
      beamClass: 'live-card-beam-purple',
      hex: '#A855F7',
    },
    red: {
      border: 'hover:border-rose-400/60 dark:hover:border-rose-400/50',
      glow: 'hover:shadow-glow-red',
      iconBg: 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20',
      badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20',
      progressFill: 'bg-gradient-to-r from-rose-400 to-red-500',
      accentGlow: 'from-rose-400/12 to-transparent',
      beamClass: 'live-card-beam-pink',
      hex: '#EF4444',
    },
    green: {
      border: 'hover:border-emerald-400/60 dark:hover:border-emerald-400/50',
      glow: 'hover:shadow-glow-green',
      iconBg: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20',
      badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
      progressFill: 'bg-gradient-to-r from-emerald-400 to-teal-500',
      accentGlow: 'from-emerald-400/12 to-transparent',
      beamClass: 'live-card-beam-green',
      hex: '#10B981',
    },
  };

  const themeConfig = colorThemes[color] || colorThemes.yellow;

  // Default lively sparkline data
  const defaultSparklines = {
    yellow: [25, 30, 28, 42, 36, 58, 50, 72],
    red: [45, 38, 55, 32, 48, 62, 40, 58],
    pink: [20, 25, 35, 40, 30, 45, 52, 60],
    purple: [60, 55, 50, 45, 40, 35, 30, 25],
    green: [20, 35, 45, 40, 60, 55, 70, 85],
    sky: [30, 42, 38, 55, 48, 65, 58, 80],
  };

  const activeSparkline = sparklineData || defaultSparklines[color] || defaultSparklines.yellow;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.015 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      onClick={onClick}
      className={`group relative p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0E1526]/95 border border-slate-200/90 dark:border-white/[0.08] shadow-soft hover:shadow-card-hover transition-all duration-300 overflow-hidden cursor-pointer ${themeConfig.beamClass} ${themeConfig.border} ${themeConfig.glow}`}
    >
      {/* Decorative ambient backdrop glow */}
      <div
        className={`absolute -top-12 -right-12 w-36 h-36 rounded-full bg-gradient-to-br ${themeConfig.accentGlow} blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500`}
      />

      {/* Top Header: Title, Live Radar Beacon & Icon */}
      <div className="flex items-center justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
            {title}
          </span>
          {/* ⚡ Live Beacon */}
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold font-mono">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span>LIVE</span>
          </span>
        </div>

        {Icon && (
          <div
            className={`p-2.5 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 shadow-sm ${themeConfig.iconBg}`}
          >
            <Icon className="w-4 h-4 stroke-[2.2]" />
          </div>
        )}
      </div>

      {/* Primary Value Display with Animated Counter & Sparkline Row */}
      <div className="flex items-end justify-between gap-3 mb-2.5">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-slate-900 dark:text-white tabular-nums">
            <LiveAnimatedCounter value={value} prefix={currency} isMasked={isMasked} />
          </h3>
          {badgeText && (
            <span
              className={`inline-block mt-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${themeConfig.badge}`}
            >
              {badgeText}
            </span>
          )}
        </div>

        {/* Live Sparkline Widget */}
        {!isMasked && (
          <div className="hidden sm:block pb-1">
            <LiveSparkline data={activeSparkline} strokeColor={themeConfig.hex} />
          </div>
        )}
      </div>

      {/* Trend Indicator & Subtext */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs pt-1">
        {change !== undefined && (
          <div
            className={`inline-flex items-center gap-1 font-bold text-[11px] px-2 py-0.5 rounded-md ${
              isPositive
                ? 'text-emerald-700 bg-emerald-500/10 dark:text-emerald-400 border border-emerald-500/20'
                : 'text-rose-700 bg-rose-500/10 dark:text-rose-400 border border-rose-500/20'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
            ) : (
              <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
            )}
            <span>{change}</span>
          </div>
        )}
        {subtext && (
          <span className="text-slate-500 dark:text-slate-400 font-medium text-[11px] truncate max-w-[200px]">
            {subtext}
          </span>
        )}
      </div>

      {/* Animated Progress Bar with smooth light scan */}
      {progress !== null && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
          <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
            <span>{progressLabel || 'Progress'}</span>
            <span className="font-mono font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full ${themeConfig.progressFill}`}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};
