const MIN_COL_WIDTH = 56;
const MIN_ROW_HEIGHT = 36;

type TableResizeState = {
    colWidths: number[];
    rowHeights: Map<number, number>;
};

const tableStates = new WeakMap<HTMLTableElement, TableResizeState>();

function getHeaderCells(table: HTMLTableElement): HTMLTableCellElement[] {
    const headerRow =
        table.tHead?.rows[0]
        ?? table.querySelector("thead tr")
        ?? table.querySelector("tr");
    if (!headerRow) return [];
    return Array.from(headerRow.children).filter(
        (cell): cell is HTMLTableCellElement =>
            cell instanceof HTMLTableCellElement
            && (cell.tagName === "TH" || cell.tagName === "TD"),
    );
}

function ensureColGroup(table: HTMLTableElement, columnCount: number): HTMLTableColElement[] {
    let colgroup = table.querySelector("colgroup[data-excel-resize='true']") as HTMLTableColElement | null;
    if (!colgroup) {
        colgroup = document.createElement("colgroup");
        colgroup.setAttribute("data-excel-resize", "true");
        table.insertBefore(colgroup, table.firstChild);
    }

    while (colgroup.children.length < columnCount) {
        colgroup.appendChild(document.createElement("col"));
    }
    while (colgroup.children.length > columnCount) {
        colgroup.lastElementChild?.remove();
    }

    return Array.from(colgroup.children) as HTMLTableColElement[];
}

function applyColumnWidths(table: HTMLTableElement, widths: number[]) {
    const cols = ensureColGroup(table, widths.length);
    widths.forEach((width, index) => {
        const col = cols[index];
        if (!col) return;
        col.style.width = `${width}px`;
        col.style.minWidth = `${width}px`;
    });
}

function getOrCreateState(table: HTMLTableElement, headerCells: HTMLTableCellElement[]): TableResizeState {
    let state = tableStates.get(table);
    if (!state) {
        state = {
            colWidths: headerCells.map((cell) => Math.max(MIN_COL_WIDTH, Math.round(cell.getBoundingClientRect().width))),
            rowHeights: new Map(),
        };
        tableStates.set(table, state);
    } else if (state.colWidths.length !== headerCells.length) {
        state.colWidths = headerCells.map((cell, index) =>
            state!.colWidths[index]
            ?? Math.max(MIN_COL_WIDTH, Math.round(cell.getBoundingClientRect().width)),
        );
    }
    return state;
}

function attachColumnHandle(
    table: HTMLTableElement,
    cell: HTMLTableCellElement,
    columnIndex: number,
) {
    if (cell.querySelector("[data-excel-col-handle='true']")) return;

    if (getComputedStyle(cell).position === "static") {
        cell.style.position = "relative";
    }

    const handle = document.createElement("span");
    handle.setAttribute("data-excel-col-handle", "true");
    handle.className = "excel-col-resize-handle";
    handle.title = "Arrastrar para cambiar el ancho";
    cell.appendChild(handle);

    handle.addEventListener("mousedown", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const state = tableStates.get(table);
        if (!state) return;

        const startX = event.clientX;
        const startWidth = state.colWidths[columnIndex] ?? cell.getBoundingClientRect().width;

        const onMove = (moveEvent: MouseEvent) => {
            const nextWidth = Math.max(MIN_COL_WIDTH, Math.round(startWidth + (moveEvent.clientX - startX)));
            state.colWidths[columnIndex] = nextWidth;
            applyColumnWidths(table, state.colWidths);
        };

        const onUp = () => {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);
            document.body.classList.remove("excel-resizing-cols");
        };

        document.body.classList.add("excel-resizing-cols");
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
    });
}

function attachRowHandle(
    table: HTMLTableElement,
    row: HTMLTableRowElement,
    rowIndex: number,
) {
    const firstCell = row.cells[0];
    if (!firstCell || firstCell.querySelector("[data-excel-row-handle='true']")) return;

    if (getComputedStyle(firstCell).position === "static") {
        firstCell.style.position = "relative";
    }

    const handle = document.createElement("span");
    handle.setAttribute("data-excel-row-handle", "true");
    handle.className = "excel-row-resize-handle";
    handle.title = "Arrastrar para cambiar la altura";
    firstCell.appendChild(handle);

    handle.addEventListener("mousedown", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const state = tableStates.get(table);
        if (!state) return;

        const startY = event.clientY;
        const startHeight = state.rowHeights.get(rowIndex)
            ?? Math.round(row.getBoundingClientRect().height);

        const onMove = (moveEvent: MouseEvent) => {
            const nextHeight = Math.max(MIN_ROW_HEIGHT, Math.round(startHeight + (moveEvent.clientY - startY)));
            state.rowHeights.set(rowIndex, nextHeight);
            row.style.height = `${nextHeight}px`;
            Array.from(row.cells).forEach((cell) => {
                cell.style.height = `${nextHeight}px`;
            });
        };

        const onUp = () => {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);
            document.body.classList.remove("excel-resizing-rows");
        };

        document.body.classList.add("excel-resizing-rows");
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
    });
}

function syncTable(table: HTMLTableElement) {
    const headerCells = getHeaderCells(table);
    if (headerCells.length === 0) return;

    table.classList.add("excel-resizable-table");
    table.style.tableLayout = "fixed";
    table.style.width = "max-content";
    table.style.minWidth = "100%";

    const state = getOrCreateState(table, headerCells);
    applyColumnWidths(table, state.colWidths);

    headerCells.forEach((cell, index) => {
        attachColumnHandle(table, cell, index);
    });

    Array.from(table.tBodies).forEach((tbody) => {
        Array.from(tbody.rows).forEach((row, rowIndex) => {
            const stored = state.rowHeights.get(rowIndex);
            if (stored) {
                row.style.height = `${stored}px`;
                Array.from(row.cells).forEach((cell) => {
                    cell.style.height = `${stored}px`;
                });
            }
            attachRowHandle(table, row, rowIndex);
        });
    });
}

/** Activa redimensionado tipo Excel en todas las tablas bajo `root`. */
export function enableExcelTableResize(root: HTMLElement): () => void {
    let frame = 0;

    const scan = () => {
        root.querySelectorAll("table").forEach((node) => {
            syncTable(node as HTMLTableElement);
        });
    };

    const schedule = () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(scan);
    };

    scan();
    const observer = new MutationObserver(schedule);
    observer.observe(root, { childList: true, subtree: true });

    return () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
    };
}
