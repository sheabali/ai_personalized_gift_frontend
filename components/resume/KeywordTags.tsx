import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface KeywordTagsProps {
  foundKeywords: string[];
  missingKeywords: string[];
}

const KeywordTags: React.FC<KeywordTagsProps> = ({ foundKeywords, missingKeywords }) => {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Found Keywords</h4>
        <div className="flex flex-wrap gap-2">
          {foundKeywords.map((keyword, index) => (
            <TooltipProvider key={`found-${index}`}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    variant="outline" 
                    className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 cursor-default px-3 py-1 rounded-full transition-colors"
                  >
                    {keyword}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Keyword found in your resume</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Missing Keywords</h4>
        <div className="flex flex-wrap gap-2">
          {missingKeywords.map((keyword, index) => (
            <TooltipProvider key={`missing-${index}`}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    variant="outline" 
                    className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 cursor-default px-3 py-1 rounded-full transition-colors"
                  >
                    {keyword}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Consider adding this keyword to your resume</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeywordTags;
