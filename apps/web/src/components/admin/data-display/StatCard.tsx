import * as React from 'react';
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: { value: number; label?: string };
  color?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const colorStyles = {
  default: {
    bg: '#F8FAFC',
    icon: '#64748B',
    border: '#E2E8F0',
  },
  success: {
    bg: '#F2F8F4',
    icon: '#435933',
    border: 'rgba(67, 89, 51, 0.12)',
  },
  warning: {
    bg: '#FEF9E7',
    icon: '#C38D1C',
    border: 'rgba(195, 141, 28, 0.12)',
  },
  danger: {
    bg: '#FEF2F2',
    icon: '#DC2626',
    border: 'rgba(220, 38, 38, 0.12)',
  },
  info: {
    bg: '#F0F9FF',
    icon: '#0284C7',
    border: 'rgba(2, 132, 199, 0.12)',
  },
};

const StatCard = ({ label, value, icon: Icon, trend, color = 'default' }: StatCardProps) => {
  const TrendIcon = trend ? (trend.value > 0 ? TrendingUp : trend.value < 0 ? TrendingDown : Minus) : null;
  const trendBg = trend 
    ? (trend.value > 0 ? '#F2F8F4' : trend.value < 0 ? '#FEF2F2' : '#F8FAFC') 
    : '#F8FAFC';
  const trendTextColor = trend 
    ? (trend.value > 0 ? '#435933' : trend.value < 0 ? '#DC2626' : '#64748B') 
    : '#64748B';
  const styles = colorStyles[color];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200/50">
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <div>
            <p className="text-[14px] font-semibold text-slate-400 tracking-tight">{label}</p>
            <p className="text-[32px] font-bold text-slate-900 mt-1.5 tracking-tight tabular-nums leading-none">
              {value}
            </p>
          </div>
          
          {trend && (
            <div 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-bold"
              style={{ backgroundColor: trendBg, color: trendTextColor }}
            >
              {TrendIcon && <TrendIcon className="w-3.5 h-3.5" strokeWidth={2.5} />}
              <span>{trend.value > 0 ? '+' : ''}{trend.value}%</span>
              {trend.label && (
                <span className="text-slate-400 font-medium ml-1">
                  {trend.label}
                </span>
              )}
            </div>
          )}
        </div>

        {Icon && (
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
            style={{ backgroundColor: styles.bg, border: `1px solid ${styles.border}` }}
          >
            <Icon className="w-6 h-6" style={{ color: styles.icon }} strokeWidth={1.5} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
