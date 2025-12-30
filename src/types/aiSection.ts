
export interface SectionTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultPrompt: string;
  structure: string[];
}

export interface SectionGenerationOptions {
  sectionType: string;
  prompt: string;
  length: 'short' | 'medium' | 'long';
  tone: 'professional' | 'casual' | 'friendly' | 'technical';
}

export interface GeneratedSection {
  title: string;
  content: string;
  type: string;
}
