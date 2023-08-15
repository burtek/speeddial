import type { DataRef, DragEndEvent } from '@dnd-kit/core';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Paper } from '@mui/material';
import type { FC } from 'react';
import { useCallback } from 'react';

import { useAppDispatch } from '@@data/redux-toolkit';
import { actions as speeddialActions, ROOT_SPEEDDIAL_ID } from '@@data/speeddial/slice';

import { GroupEditDialog } from './edit-group-dialog';
import { LinkEditDialog } from './edit-link-dialog';
import { GroupContents } from './group-contents';
import type { TypedSortableData } from './hooks/use-typed-sortable';


export const SpeedDial: FC<{ gridArea?: string }> = ({ gridArea }) => {
    const dispatch = useAppDispatch();

    const onDragEnd = useCallback(({ active, over }: DragEndEvent) => {
        if (over && active.id !== over.id) {
            const from = (active.data as DataRef<TypedSortableData>).current?.index;
            const to = (over.data as DataRef<TypedSortableData>).current?.index;
            const groupId = (over.data as DataRef<TypedSortableData>).current?.parentId;

            if (typeof from === 'number' && typeof to === 'number'&& groupId) {
                dispatch(speeddialActions.reorderTiles({ groupId, from, to }));
            }
        }
    }, [dispatch]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
    );

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
        >
            <Paper elevation={3} sx={{ gridArea }}>
                <GroupContents groupId={ROOT_SPEEDDIAL_ID} />
            </Paper>
            <LinkEditDialog />
            <GroupEditDialog />
        </DndContext>
    );
};
