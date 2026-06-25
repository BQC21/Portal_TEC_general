export const getDarkSilverColorClass = (value: string | number | null | undefined) => {
        if (value === "NaN" || value === "Infinity" || value === null || 
                value === undefined || value === "" || value === "0" || value === 0) return "bg-[#BFAC7E]"; 
        return "bg-slate-400"; // Default color
    };

export const getLightSilverColorClass = (value: string | number | null | undefined) => {
    if (value === "NaN" || value === "Infinity" || value === null || 
            value === undefined || value === "" || value === 0 || value === "0") return "bg-[#F0B746]"; 
    return "bg-slate-200"; // Default color
};