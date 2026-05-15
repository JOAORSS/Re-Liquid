export interface Settings {
    bg_color: string;
    text_color: string;
    layout_style: 'columns' | 'rows';
    image_position: 'default' | 'inverted';
    image: string | null;
    image_label: string;
    richtext: string;
}
