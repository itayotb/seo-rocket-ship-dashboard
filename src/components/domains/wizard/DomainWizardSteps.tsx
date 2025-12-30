
import React from 'react';

export interface DomainWizardStepConfig {
  title: string;
  description: string;
}

export const getDomainWizardSteps = (isEditing: boolean): DomainWizardStepConfig[] => [
  {
    title: isEditing ? 'Edit Domain' : 'Add Domain',
    description: isEditing ? 'Update your domain information' : 'Enter your domain name to get started'
  },
  {
    title: 'Select Cloudflare Account',
    description: 'Choose which Cloudflare account to use'
  },
  {
    title: 'Nameservers',
    description: 'Update these nameservers at your domain registrar'
  },
  {
    title: 'Complete',
    description: isEditing ? 'Your domain has been updated successfully' : 'Your domain has been added successfully'
  }
];
