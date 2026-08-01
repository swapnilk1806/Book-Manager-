import React from 'react';

interface StatsCardProps {
  label: string;
  value: number;
  icon: string;
  color?: string;
  delay?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  label, 
  value, 
  icon, 
  color, 
  delay 
}) => {
  return (
    <div 
      className="stat-card animate-fadeInUp" 
      style={{ 
        animationDelay: delay || '0ms' 
      }}
    >
      <span className="stat-icon">{icon}</span>
      <div className="stat-label">{label}</div>
      <div 
        className="stat-value" 
        style={{ color: color || '#1a1a2e' }}
      >
        {value}
      </div>
    </div>
  );
};