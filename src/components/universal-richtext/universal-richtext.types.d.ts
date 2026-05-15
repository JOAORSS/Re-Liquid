export interface Settings {
    bg_color: string;
    text_color: string;
    layout_position: 'left' | 'right' | 'center';
    media_type: 'title' | 'image' | 'none';
    title: string;
    image: string | null;
    richtext: string;
    cta_text: string;
    cta_url: string;
}
