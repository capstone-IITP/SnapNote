import React from 'react';
import { Note } from './types';

// Extended sophisticated color palette with carefully selected hues
const colors = [
  // Soft pastels
  '#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF',
  // Rich mid-tones
  '#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA', '#DEE2FF', '#F6C5D8',
  // Elegant muted tones
  '#F0E6EF', '#D4E5F7', '#E0F1E0', '#FFECD3', '#F8E1EC', '#D8E1FF', '#E8F3D8', '#FFDDE5',
  // Sophisticated darks
  '#B5838D', '#6D6875', '#7F95D1', '#6A8D73', '#885A5A', '#797596', '#8A7968', '#857C8D'
];

// Gradients for more sophisticated note appearances
export const gradients = [
  'linear-gradient(135deg, #F6D365 0%, #FDA085 100%)',
  'linear-gradient(135deg, #5EE7DF 0%, #B490CA 100%)',
  'linear-gradient(135deg, #FFD3A5 0%, #FD6585 100%)', 
  'linear-gradient(135deg, #C2FFD8 0%, #465EFB 100%)',
  'linear-gradient(135deg, #ABDCFF 0%, #0396FF 100%)',
  'linear-gradient(135deg, #FEB692 0%, #EA5455 100%)',
  'linear-gradient(135deg, #CE9FFC 0%, #7367F0 100%)',
  'linear-gradient(135deg, #90F7EC 0%, #32CCBC 100%)',
  'linear-gradient(135deg, #FFF6B7 0%, #F6416C 100%)',
  'linear-gradient(135deg, #81FBB8 0%, #28C76F 100%)',
  'linear-gradient(135deg, #E2B0FF 0%, #9F44D3 100%)',
  'linear-gradient(135deg, #F97794 0%, #623AA2 100%)',
  'linear-gradient(135deg, #FCCF31 0%, #F55555 100%)',
  'linear-gradient(135deg, #F761A1 0%, #8C1BAB 100%)'
];

// Tags for categorizing notes
export const noteTags = [
  'work', 'personal', 'shopping', 'idea', 'reminder', 'important', 'later', 'project', 'inspiration'
];

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const getRandomColor = (): string => {
  return colors[Math.floor(Math.random() * colors.length)];
};

export const getRandomGradient = (): string => {
  return gradients[Math.floor(Math.random() * gradients.length)];
};

export const getRandomSize = (): { width: number; height: number } => {
  // Random sizes for variety with reasonable min/max bounds
  const width = Math.max(180, Math.floor(Math.random() * 100) + 200); // 200-300px
  const height = Math.max(150, Math.floor(Math.random() * 120) + 150); // 150-270px
  
  return { width, height };
};

export const getRandomRotation = (): number => {
  // Slight rotation for visual interest (-4 to 4 degrees)
  return Math.random() * 8 - 4;
};

/**
 * Creates a new note at the specified position
 */
export const createNewNote = (x: number, y: number): Note => {
  const now = Date.now();
  const useGradient = Math.random() > 0.5; // 50% chance to use gradient
  
  return {
    id: generateId(),
    content: '',
    position: { x, y },
    size: getRandomSize(),
    color: useGradient ? getRandomGradient() : getRandomColor(),
    zIndex: now,
    rotation: getRandomRotation(),
    tags: [],
    createdAt: now,
    lastModified: now
  };
};

/**
 * Escapes special characters in a string for use in a regular expression
 */
export const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}; 