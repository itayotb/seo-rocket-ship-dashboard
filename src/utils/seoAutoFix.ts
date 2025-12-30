import { ContentItem } from '@/types/website';

export interface SeoAutoFixResult {
  success: boolean;
  message: string;
  updatedItem?: ContentItem;
}

export class SeoAutoFixService {
  private static generateOptimalTitle(originalTitle: string, targetLength: number = 55): string {
    if (originalTitle.length >= 30 && originalTitle.length <= 60) {
      return originalTitle;
    }

    if (originalTitle.length < 30) {
      // Expand short titles with descriptive words
      const expansionWords = ['Guide', 'Tips', 'Best Practices', 'Complete', 'Professional', 'Expert'];
      const randomExpansion = expansionWords[Math.floor(Math.random() * expansionWords.length)];
      return `${originalTitle} - ${randomExpansion}`.slice(0, targetLength);
    } else {
      // Trim long titles while keeping important keywords
      return originalTitle.slice(0, targetLength - 3) + '...';
    }
  }

  private static generateOptimalMetaDescription(content: string, title: string): string {
    // Extract first meaningful sentence or paragraph
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    let description = sentences[0]?.trim() || title;
    
    // Add call-to-action if space allows
    const cta = ' Learn more about our services and solutions.';
    const targetLength = 155;
    
    if (description.length + cta.length <= targetLength) {
      description += cta;
    }
    
    return description.slice(0, targetLength);
  }

  private static addBasicStructure(content: string): string {
    // If content lacks headers, add basic structure
    if (!/#{1,6}\s/.test(content) && !/<h[1-6]/.test(content)) {
      const paragraphs = content.split('\n\n').filter(p => p.trim());
      if (paragraphs.length > 1) {
        // Add headers to structure the content
        let structuredContent = `## Overview\n\n${paragraphs[0]}\n\n`;
        if (paragraphs.length > 2) {
          structuredContent += `## Key Information\n\n${paragraphs.slice(1, -1).join('\n\n')}\n\n`;
          structuredContent += `## Summary\n\n${paragraphs[paragraphs.length - 1]}`;
        } else {
          structuredContent += `## Details\n\n${paragraphs[1]}`;
        }
        return structuredContent;
      }
    }
    return content;
  }

  static async fixTitleLength(item: ContentItem): Promise<SeoAutoFixResult> {
    try {
      const optimizedTitle = this.generateOptimalTitle(item.title);
      const updatedItem = { ...item, title: optimizedTitle };
      
      return {
        success: true,
        message: `Title optimized to ${optimizedTitle.length} characters`,
        updatedItem
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to optimize title length'
      };
    }
  }

  static async fixMetaDescription(item: ContentItem): Promise<SeoAutoFixResult> {
    try {
      const optimizedMeta = this.generateOptimalMetaDescription(item.content, item.title);
      const updatedItem = { ...item, metaDescription: optimizedMeta };
      
      return {
        success: true,
        message: `Meta description optimized to ${optimizedMeta.length} characters`,
        updatedItem
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to optimize meta description'
      };
    }
  }

  static async fixContentStructure(item: ContentItem): Promise<SeoAutoFixResult> {
    try {
      const structuredContent = this.addBasicStructure(item.content);
      const wordCount = structuredContent.trim().split(/\s+/).filter(word => word.length > 0).length;
      const updatedItem = { 
        ...item, 
        content: structuredContent,
        wordCount
      };
      
      return {
        success: true,
        message: 'Content structure improved with headers',
        updatedItem
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to improve content structure'
      };
    }
  }

  static async expandContent(item: ContentItem): Promise<SeoAutoFixResult> {
    try {
      const additionalContent = `\n\n## Additional Information\n\nThis section provides more detailed insights and context to help you better understand the topic. We continuously update our content to ensure it remains relevant and valuable to our readers.\n\n### Key Benefits\n\n- Comprehensive coverage of the subject matter\n- Expert insights and recommendations\n- Practical tips and actionable advice\n- Regular updates with the latest information`;
      
      const expandedContent = item.content + additionalContent;
      const wordCount = expandedContent.trim().split(/\s+/).filter(word => word.length > 0).length;
      const updatedItem = { 
        ...item, 
        content: expandedContent,
        wordCount
      };
      
      return {
        success: true,
        message: `Content expanded to ${wordCount} words`,
        updatedItem
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to expand content'
      };
    }
  }
}
