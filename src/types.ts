export interface Note {
  id: string;
  content: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  color: string;
  zIndex: number;
  rotation: number;
  tags: string[];
  createdAt: number;
  lastModified: number;
} 