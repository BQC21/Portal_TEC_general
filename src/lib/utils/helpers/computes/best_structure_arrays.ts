export type StructureOption = {
    id: string
    capacity: number
    unitCost: number
}

/**
 * Reparte los módulos entre varias estructuras sin exceder el total: busca la mayor
 * capacidad alcanzable que no lo supere y, entre las combinaciones que la alcanzan,
 * la más barata. Devuelve cuántas unidades usar de cada estructura.
 */
export function bestStructureCombination(
    totalUnits: number,
    options: StructureOption[],
): Map<string, number> {
    const counts = new Map(options.map((option) => [option.id, 0]))
    const capacity = Math.floor(totalUnits)
    if (!Number.isFinite(capacity) || capacity <= 0) return counts

    // cost[w]: costo mínimo para cubrir exactamente w módulos; Infinity si w no es alcanzable.
    const cost = new Array<number>(capacity + 1).fill(Number.POSITIVE_INFINITY)
    const chosen = new Array<number>(capacity + 1).fill(-1)
    cost[0] = 0

    for (let covered = 1; covered <= capacity; covered++) {
        options.forEach((option, index) => {
            const previous = covered - option.capacity
            if (previous < 0 || cost[previous] === Number.POSITIVE_INFINITY) return
            const candidate = cost[previous] + option.unitCost
            if (candidate < cost[covered]) {
                cost[covered] = candidate
                chosen[covered] = index
            }
        })
    }

    let bestCovered = 0
    for (let covered = capacity; covered >= 0; covered--) {
        if (cost[covered] < Number.POSITIVE_INFINITY) {
            bestCovered = covered
            break
        }
    }

    for (let covered = bestCovered; covered > 0 && chosen[covered] >= 0;) {
        const option = options[chosen[covered]]
        counts.set(option.id, (counts.get(option.id) ?? 0) + 1)
        covered -= option.capacity
    }

    return counts
}
