export type StructureOption = {
    id: string
    capacity: number
    unitCost: number
}

export type StructureCombinationMode = "at-most" | "at-least"

/**
 * Reparte unidades entre varias estructuras al menor costo.
 * - at-most (módulos): mayor cobertura que no exceda el total.
 * - at-least (racks de baterías): menor costo que cubra al menos el total.
 */
export function bestStructureCombination(
    totalUnits: number,
    options: StructureOption[],
    mode: StructureCombinationMode = "at-most",
): Map<string, number> {
    const counts = new Map(options.map((option) => [option.id, 0]))
    const capacity = Math.floor(totalUnits)
    const maxItemCapacity = Math.max(0, ...options.map((option) => option.capacity))
    if (!Number.isFinite(capacity) || capacity <= 0 || maxItemCapacity <= 0) return counts

    const limit = mode === "at-least" ? capacity + maxItemCapacity : capacity

    // cost[w]: costo mínimo para cubrir exactamente w unidades; Infinity si w no es alcanzable.
    const cost = new Array<number>(limit + 1).fill(Number.POSITIVE_INFINITY)
    const chosen = new Array<number>(limit + 1).fill(-1)
    cost[0] = 0

    for (let covered = 1; covered <= limit; covered++) {
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
    if (mode === "at-least") {
        let bestCost = Number.POSITIVE_INFINITY
        for (let covered = capacity; covered <= limit; covered++) {
            if (cost[covered] < bestCost) {
                bestCost = cost[covered]
                bestCovered = covered
            }
        }
        if (bestCost === Number.POSITIVE_INFINITY) return counts
    } else {
        for (let covered = capacity; covered >= 0; covered--) {
            if (cost[covered] < Number.POSITIVE_INFINITY) {
                bestCovered = covered
                break
            }
        }
    }

    for (let covered = bestCovered; covered > 0 && chosen[covered] >= 0;) {
        const option = options[chosen[covered]]
        counts.set(option.id, (counts.get(option.id) ?? 0) + 1)
        covered -= option.capacity
    }

    return counts
}
