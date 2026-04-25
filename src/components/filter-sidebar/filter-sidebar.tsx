import "./filter-sidebar.css"

interface TFilters {
    jewel: { stone: string, image: string}[], 
    types: string[], 
    priceFilter: { min: number, max: number, currency: string } 
}

export function FilterSidebar({ filters } : { filters: TFilters }) {

    //const [stone, setStone] = useState<string | null>(null);

    // function StoneFilter({ stone, image } : { stone: string, image: string }) {
    //     return (
    //         <button onClick={() => (setStone(stone))} className="filter-section">
    //             <img className="stone-image" src={image} alt={stone} />
    //             <label className="label-image" >{stone}</label>
    //         </button>
    //     )
    // };

    // function StoneFilter({ stone, image } : { stone: string, image: string }) {
    //     return (
    //         <button onClick={() => (setStone(stone))} className="filter-section">
    //             <img className="stone-image" src={image} alt={stone} />
    //             <label className="label-image" >{stone}</label>
    //         </button>
    //     )
    // };
    
    return (
        <aside>
            <div className="filter-section">
                {filters.jewel.map((stone, index) => (
                    //<StoneFilter key={`stone-${index}`} stone={stone.stone} image={stone.image} />
                    <p key={`stone-${index}`}>{stone.stone}</p>
                ))}
            </div>  

            <div className="filter-section">
                
            </div>

            <div className="filter-section">
                
            </div>
        </aside>


    )
}