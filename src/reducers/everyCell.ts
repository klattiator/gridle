import {createWalker, selectCell} from "../core";
import {Grid, Position} from "../core/types";

export interface EveryCellPredicate<T> {
    /**
     * @param cellValue The current cell being processed in the grid.
     * @param position The position of the current cell being processed in the grid, starting from 0.
     * @param index The index of the current cell being processed in the grid, starting from 0.
     * @param srcGrid The grid `everyCell` was called upon.
     */
     (cellValue: T, position: Position, index: number, srcGrid: Grid<T>): boolean
}

/**
 * True if `predicate` returns true for all cells in the grid.
 *
 * @param grid The grid to be checked.
 * @param predicate The callback function to be matched.
 * @template T The cell type.
 * @since 0.11.3
 *
 * @example ```js
 * const grid = createGridFromArray2D([
 *     [1, 2, 3],
 *     [4, 5, 6],
 * ]);
 *
 * const lessThan10 = (cell: number) => cell < 10;
 * everyCell(grid, lessThan10); // => true
 *
 * const equal5 = (cell: number) => cell === 5;
 * everyCell(grid, equal5); // => false
 * ```
 */
export function everyCell<T>(grid: Grid<T>, predicate: EveryCellPredicate<T>): boolean {
    const walker = createWalker(grid);
    let step = walker.next();

    while (!step.done) {
        const {index, position} = step.value;
        const cell = selectCell({...position, grid}) as T;
        const res = predicate(cell, position, index, grid);
        if (!res) {
            return false;
        }
        step = walker.next();
    }

    return true;
}
