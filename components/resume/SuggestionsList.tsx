import React from 'react';
import { AlertCircle, ArrowUpCircle, Info } from 'lucide-react';

export interface Suggestion {
  title: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface SuggestionsListProps {
  suggestions: Suggestion[];
}

const SuggestionsList: React.FC<SuggestionsListProps> = ({ suggestions }) => {
  const sortedSuggestions = [...suggestions]
    .sort((a, b) => {
      const priorityOrder = { 'HIGH': 0, 'MEDIUM': 1, 'LOW': 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 5);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'MEDIUM':
        return <ArrowUpCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {sortedSuggestions.map((suggestion, index) => (
        <div 
          key={index} 
          className="flex gap-4 p-4 bg-white border-[0.5px] border-gray-100 rounded-[8px] hover:shadow-md transition-shadow"
        >
          <div className="mt-1">
            {getPriorityIcon(suggestion.priority)}
          </div>
          <div>
            <h5 className="font-bold text-gray-800 text-sm">{suggestion.title}</h5>
            <p className="text-gray-600 text-xs mt-1 leading-relaxed">
              {suggestion.description}
            </p>
          </div>
        </div>
      ))}
      {suggestions.length === 0 && (
        <p className="text-gray-400 text-sm italic">No suggestions found. Your resume looks great!</p>
      )}
    </div>
  );
};

export default SuggestionsList;
