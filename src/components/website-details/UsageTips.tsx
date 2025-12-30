
import React from 'react';

const UsageTips: React.FC = () => {
  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
      <h4 className="font-medium mb-2">Tips for Best Results</h4>
      <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
        <li>• Use 'Natural' placement for the most readable results</li>
        <li>• Keep keyword density moderate (30-50% of paragraphs)</li>
        <li>• Use relevant, contextual keywords for your content</li>
        <li>• Review the content after insertion to ensure readability</li>
      </ul>
    </div>
  );
};

export default UsageTips;
