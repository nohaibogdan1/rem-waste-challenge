import { useEffect, useState } from "react";
import AttentionMarkIcon from "./icons/AttentionMarkIcon";

type Size = {
    "id": number,
    "size": number,
    "hire_period_days": number,
    "transport_cost": number | null,
    "per_tonne_cost": number | null,
    "price_before_vat": number,
    "vat": number,
    "postcode": string,
    "area": string,
    "forbidden": boolean,
    "allowed_on_road": boolean,
    "allows_heavy_waste": boolean
}

export default function SizesPicker({
    size,
    selectSize,
    hasHeavyWaste
}: {
    selectSize: (id: number) => void;
    size?: number;
    hasHeavyWaste?: boolean;
}) {
    const [sizes, setSizes] = useState<Size[]>([]);
    const [selected, setSelected] = useState<number | undefined>(size || undefined);

    useEffect(() => {
        async function fetchSkipSizes() {
            const res = await fetch("https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft");
            const data = await res.json();
            if (!res.ok) {
                return;
            }

            setSizes(data);
        }
        fetchSkipSizes();
    }, []);

    function handleSelect(size: Size) {
        if (hasHeavyWaste && size.allows_heavy_waste || !hasHeavyWaste) {
            setSelected(size.id);
            selectSize(size.id);
        }
    }

    const allowedSizes = hasHeavyWaste ? sizes.filter(size => size.allows_heavy_waste) : sizes;
    const notAllowedSizes = hasHeavyWaste ? sizes.filter(size => !size.allows_heavy_waste) : [];
    return (
        <div className="max-w-xl mx-auto px-4 pb-32">
            <h2 className="text-2xl font-bold text-center mb-4">Choose Your Skip Size</h2>

            <p className="text-gray-400 text-center mb-8">Select the skip size that best suits your needs</p>
            <div className="flex flex-col gap-7">
                {[...allowedSizes, ...notAllowedSizes].map(size => {
                    const isNotAllowed = hasHeavyWaste && !size.allows_heavy_waste;
                    return (
                        <label key={size.id} className={`min-h-28 rounded-lg border-2 p-4 md:p-3 transition-all border-gray bg-dark text-white 
                            ${selected === size.id ? "border-primary" : isNotAllowed ? "" : "hover:border-[var(--color-primary)]/50"} 
                            ${isNotAllowed ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
                            <input
                                className="opacity-0 absolute"
                                type="radio"
                                value={size.id}
                                checked={selected === size.id}
                                onChange={() => handleSelect(size)}
                                disabled={isNotAllowed}
                            />
                            <div className="flex justify-between">
                                <h3 className="text-lg md:text-xl font-semibold text-white">{size.size} Yeard Skip</h3>
                                <p className="text-xl md:text-2xl font-bold text-[#0037C1]">£{size.price_before_vat}</p>
                            </div>
                            <p className="text-sm text-gray-40 mt-1">{size.hire_period_days} day hire period</p>
                            <div className="flex justify-between mt-2">
                                {!size.allowed_on_road &&
                                    <div className="flex gap-2 items-center text-yellow-500">
                                        <AttentionMarkIcon />
                                        <span className="text-xs font-medium">Not Allowed On The Road</span>
                                    </div>
                                }
                                {isNotAllowed &&
                                    <div className="flex gap-2 items-center text-red-500 mt-1">
                                        <AttentionMarkIcon />
                                        <span className="text-xs font-medium">Not Suitable for Heavy Waste</span>
                                    </div>
                                }
                            </div>
                        </label>

                    )
                })}
            </div>
        </div>
    );
}