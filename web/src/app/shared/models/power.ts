export interface Power {
  id: number;
  name: string;
  ref: string;
  type: 'generation' | 'demand';
}
