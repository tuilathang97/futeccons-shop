export interface NewsMetadata {
  title: string;
  description: string;
  keywords: string;
  image: string;
  url: string;
  date: string;
  slug: string;
}

export interface NewsPost extends NewsMetadata {
  content?: React.ComponentType;
} 