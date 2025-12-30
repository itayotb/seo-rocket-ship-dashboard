
import { useState } from 'react';
import { Credential } from '@/types/credential';

const mockCredentials: Credential[] = [
  {
    id: '1',
    name: 'Gmail Account',
    username: 'example@gmail.com',
    password: 'securePassword123',
    apiKey: '',
    category: 'business',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'AWS Console',
    username: 'admin@company.com',
    password: 'awsPass456!',
    apiKey: 'AKIAIOSFODNN7EXAMPLE',
    category: 'health',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-12'
  },
  {
    id: '3',
    name: 'Cloudflare API',
    username: 'cf-user@domain.com',
    password: 'cfSecure789',
    apiKey: 'c2547eb745079dac9320b638f5e225cf483cc5cfdda41',
    category: 'ecommerce',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-08'
  }
];

export const useCredentials = () => {
  const [credentials, setCredentials] = useState<Credential[]>(mockCredentials);

  const addCredential = (name: string, username: string, password: string, apiKey: string, category: string) => {
    const newCredential: Credential = {
      id: Date.now().toString(),
      name,
      username,
      password,
      apiKey: apiKey || undefined,
      category,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setCredentials(prev => [...prev, newCredential]);
  };

  const updateCredential = (id: string, name: string, username: string, password: string, apiKey: string, category: string) => {
    setCredentials(prev =>
      prev.map(cred =>
        cred.id === id
          ? {
              ...cred,
              name,
              username,
              password,
              apiKey: apiKey || undefined,
              category,
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : cred
      )
    );
  };

  const deleteCredential = (id: string) => {
    setCredentials(prev => prev.filter(cred => cred.id !== id));
  };

  const getCredentialById = (id: string) => {
    return credentials.find(cred => cred.id === id);
  };

  return {
    credentials,
    addCredential,
    updateCredential,
    deleteCredential,
    getCredentialById
  };
};
