export interface Settings {
  id: string;
  type: string;
  settings: {
    title: string;
    richtext: string;
    'title-ta': string;
    'text-ta': string;
    'title-tb': string;
    image: string | null;
    'title-tc': string;
    'text-tc': string;
  }
}
