import { injectLiquidRaw } from "../../util/shopify";
import "./crystal-about.css";

const crystalData = injectLiquidRaw(`
    {%- capture raw_database -%}
        {%- render 'crystal-db' -%}
    {%- endcapture -%}

    {%- assign all_tags = product.tags | join: ' ' -%}
    {%- assign search_pool = product.title | append: ' ' | append: product.description | append: ' ' | append: all_tags | downcase -%}

    {%- assign stones_string = "African Bloodstone,Turquoise,Agate,African Blood,Amazonite,Amber,Amethyst,Angelite,Apatite,Apophyllite,Aquamarine,Aragonite,Aura quartz,Aventurine,Azurite,Black Kyanite,Black Tourmaline,Bloodstone,Blue Aragonite,Blue Lace Agate,Blue Calcite,Blue Quartz,Blue Goldstone,Blue Tourmaline,Calcite,Caribbean Blue Calcite,Fire Quartz,Flower Agate,Fluorite,Fuchsite,Garnet,Golden Healer Quartz,Golden Obsidian,Grape Agate,Green Jade,Green Fluorite,Green Tourmaline,Green Jasper,Halite,Hematite,Howlite,Iolite,Jasper,Kyanite,Labradorite,Lapis Lazuli,Larimar,Lava Stone,Lemon Calcite,Lepidolite,Mahogany Obsidian,Malachite,Mica,Moldavite,Mookaite,Moonstone,Moss Agate,Obsidian,Ocean Jasper,Opal,Opalite,Orchid calcite,Peach Moonstone,Peach Selenite,Peacock,Pearl,Peridot,Pink Amethyst,Pink Opal,Pink Tourmaline,Picasso Jasper,Pistachio Calcite,Polychrome Jasper,Prehnite,Pyrite,Rhodochrosite,Rhodonite,Red Vein Jasper,Rose Calcite,Rose Quartz,Root Fluorite,Rutilated quartz,Ruby,Ruby Fuschite,Ruby Kyanite,Ruby Zoisite,Selenite,Serpentine,Shungite,Smoky Quartz,Sodalite,Strawberry Quartz,Sunstone,Silver Sheen Obsidian,Tangerine Quartz,Tigers Eye,Tourmalinated Quartz,Turquoise,Unakite,Vanadinite,White Agate,Yellow Calcite,Yellow Jasper,Carnelian,Celestine,Chevron Amethyst,Chrysocolla,Chrysoprase,Citrine,Clear Quartz,Dalmatian Jasper,Desert Rose,Dragon’s Blood Jasper,Emerald" -%}
    {%- assign stones_array = stones_string | split: ',' -%}

    {%- assign target_stone = "" -%}
    {%- assign max_size = 0 -%}

    {%- for stone in stones_array -%}
        {%- assign stone_down = stone | downcase | strip -%}
        
        {%- if search_pool contains stone_down -%}
            {%- assign current_size = stone | strip | size -%}
            
            {%- if current_size > max_size -%}
                {%- assign target_stone = stone | strip -%}
                {%- assign max_size = current_size -%}
            {%- endif -%}
        {%- endif -%}
    {%- endfor -%}

    {%- assign final_json = "null" -%}

{%- if target_stone != "" -%}
        {%- assign stone_records = raw_database | strip | split: '|||' -%}

        {%- for record in stone_records -%}
            {%- assign fields = record | split: '~~~' -%}
            {%- assign current_name = fields[0] | strip -%}

            {%- if current_name == target_stone -%}
                {%- assign f_name = fields[0] | strip | escape -%}
                {%- assign f_benefits = fields[1] | strip | escape -%}
                {%- assign f_readmore = fields[2] | strip -%}
                
                {%- assign image_filename = fields[3] | strip -%}
                
                {%- if image_filename == '' -%}
                    {%- assign f_image = product.images.last | img_url: 'master' -%}
                {%- else -%}
                    {%- assign f_image = image_filename | asset_url -%}
                {%- endif -%}
                
                {%- assign final_json = '{ "name": "' | append: f_name | append: '", "benefits": "' | append: f_benefits | append: '", "readmore": "' | append: f_readmore | append: '", "image": "' | append: f_image | append: '" }' -%}
                {%- break -%}
            {%- endif -%}
        {%- endfor -%}
    {%- endif -%}
    
    {{ final_json | strip_newlines }}
`);

export function CrystalAbout() {

    return (
        <div className="about">
            <img src={crystalData.image} alt={crystalData.name} />
            <div>
                <h2>{crystalData.name}</h2>
                <p className="readmore" dangerouslySetInnerHTML={{ __html: crystalData.readmore }} />
                <div className="features">
                </div>
            </div>
        </div>
    );
}