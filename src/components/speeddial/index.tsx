import type { DragEndEvent } from '@dnd-kit/core';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { Paper } from '@mui/material';
import type { FC } from 'react';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '@@data/index';
import { getRootTiles } from '@@data/speeddial.selectors';
import { actions as speeddialActions, ROOT_SPEEDDIAL_ID } from '@@data/speeddial/slice';
import { AddNewTile } from './add-tile';
import { TileEditDialog } from './edit-dialog';
import { GroupTile } from './tile-group';
import { LinkTile } from './tile-link';

export const SpeedDial: FC<{ gridArea?: string }> = ({ gridArea }) => {
    const rootTiles = useSelector(getRootTiles);

    const dispatch = useAppDispatch();

    const onDragEnd = useCallback(({ active, over }: DragEndEvent) => {
        if (over && active.id !== over.id) {
            const from = rootTiles.findIndex(t => t.id === active.id);
            const to = rootTiles.findIndex(t => t.id === over.id);

            if (from >= 0 && to >= 0) {
                dispatch(speeddialActions.reorderTiles({ groupId: ROOT_SPEEDDIAL_ID, from, to }));
            }
        }
    }, [dispatch, rootTiles]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
    );

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
        >
            <SortableContext id={ROOT_SPEEDDIAL_ID} items={rootTiles}>
                <Paper
                    elevation={3}
                    sx={{
                        gridArea,
                        'padding': '2vw',
                        'display': 'flex',
                        'gap': '1vw',
                        'alignItems': 'stretch',
                        '& > *': { flexShrink: 0 },
                        'flexWrap': 'wrap'
                    }}
                >
                    {rootTiles.map(tile => {
                        switch (tile.type) {
                            case 'link':
                                return (
                                    <LinkTile
                                        key={tile.id}
                                        parentId={ROOT_SPEEDDIAL_ID}
                                        tile={tile}
                                    />
                                );
                            case 'group':
                                return <GroupTile key={tile.id} tile={tile} />;
                            default:
                                return null;
                        }
                    })}
                    <AddNewTile parentId={ROOT_SPEEDDIAL_ID} />
                </Paper>
            </SortableContext>
            <TileEditDialog />
        </DndContext>
    );
};
