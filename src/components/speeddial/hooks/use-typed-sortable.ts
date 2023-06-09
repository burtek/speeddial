import type { UseSortableArguments } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';


export interface TypedSortableData {
    index: number;
    parentId: string;
}

export const useTypedSortable = (args: UseSortableArguments & { data: TypedSortableData }) => useSortable(args);
