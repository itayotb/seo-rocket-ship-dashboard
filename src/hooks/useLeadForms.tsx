
import { useState } from 'react';
import { LeadForm } from '@/types/leadForm';

const initialLeadForms: LeadForm[] = [
  {
    id: '1',
    name: 'Contact Form Basic',
    code: '<form action="/submit" method="POST">\n  <input type="text" name="name" placeholder="Name" />\n  <input type="email" name="email" placeholder="Email" />\n  <button type="submit">Submit</button>\n</form>',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Newsletter Signup',
    code: '<form action="/newsletter" method="POST">\n  <input type="email" name="email" placeholder="Enter your email" />\n  <button type="submit">Subscribe</button>\n</form>',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  }
];

export const useLeadForms = () => {
  const [leadForms, setLeadForms] = useState<LeadForm[]>(initialLeadForms);

  const addLeadForm = (name: string, code: string) => {
    const newLeadForm: LeadForm = {
      id: Date.now().toString(),
      name,
      code,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setLeadForms(prev => [...prev, newLeadForm]);
    return newLeadForm;
  };

  const updateLeadForm = (id: string, name: string, code: string) => {
    setLeadForms(prev =>
      prev.map(form =>
        form.id === id
          ? { ...form, name, code, updatedAt: new Date().toISOString().split('T')[0] }
          : form
      )
    );
  };

  const deleteLeadForm = (id: string) => {
    setLeadForms(prev => prev.filter(form => form.id !== id));
  };

  const getLeadFormById = (id: string) => {
    return leadForms.find(form => form.id === id);
  };

  return {
    leadForms,
    addLeadForm,
    updateLeadForm,
    deleteLeadForm,
    getLeadFormById
  };
};
