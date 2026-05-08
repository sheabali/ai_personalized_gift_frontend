import React from 'react';

interface ScoreCardProps {
  score: number;
  label: string;
  color: string;
  subtext?: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score, label, color, subtext }) => {
  return (
    <div className="bg-white border-[0.5px] border-gray-200 rounded-[8px] p-6 flex flex-col items-center justify-center shadow-sm">
      <div 
        className="text-5xl font-bold mb-2" 
        style={{ color }}
      >
        {score}
      </div>
      <div className="text-gray-600 font-semibold text-lg">{label}</div>
      {subtext && (
        <div className="text-gray-400 text-sm mt-1">{subtext}</div>
      )}
    </div>
  );
};

export default ScoreCard;
