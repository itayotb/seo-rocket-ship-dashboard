
import React from 'react';

const AiUsageTips: React.FC = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <h4 className="font-medium mb-2">Tips for Better Results</h4>
      <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
        <li>• Be specific about your target audience</li>
        <li>• Include key points you want to cover</li>
        <li>• Mention your industry or business type</li>
        <li>• Review and edit generated content before publishing</li>
      </ul>
    </div>
  );
};

export default AiUsageTips;
