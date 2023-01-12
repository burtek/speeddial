import { CSS as DndCss } from '@dnd-kit/utilities';
import { CardContent, CardMedia, Typography } from '@mui/material';
import { useCallback, useMemo } from 'react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '@@data/index';
import { groupAdapterSelectors } from '@@data/speeddial/selectors';
import type { SpeeddialLink } from '@@data/speeddial/slice';
import { actions as speeddialActions } from '@@data/speeddial/slice';

import { TILE_CONTENT_HEIGHT } from './components/_constants';
import { AnchorTile } from './components/tile';
import { useContextMenu } from './hooks/use-context-menu';
import { useTypedSortable } from './hooks/use-typed-sortable';

export const LinkTile: FC<Props> = ({ index, parentId, tile }) => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const onEdit = useCallback(() => {
        dispatch(speeddialActions.editTile({ id: tile.id, type: 'link' }));
    }, [dispatch, tile]);
    const onMoveToGroup = useCallback((target: string) => {
        dispatch(speeddialActions.moveLinkToGroup({ source: parentId, target, linkId: tile.id }));
    }, [dispatch, parentId, tile.id]);
    const onDelete = useCallback(() => {
        dispatch(speeddialActions.deleteLink({ id: tile.id, parentId }));
    }, [dispatch, tile, parentId]);

    const groups = useSelector(groupAdapterSelectors.selectAll);
    const groupOptions = useMemo(
        () => groups.map(g => ({ value: g.id, label: g.name })).filter(g => g.value !== parentId),
        [groups, parentId]
    );

    const contextMenu = useContextMenu([
        { key: 'edit', action: onEdit, label: t('actions.edit') },
        { key: 'moveToGroup', action: onMoveToGroup, label: t('actions.moveToGroup'), options: groupOptions },
        { key: 'delete', action: onDelete, label: t('actions.delete'), requireConfirm: t('actions.delete_confirm') }
    ], tile.id);

    const {
        attributes,
        isDragging,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useTypedSortable({ data: { index, parentId }, id: tile.id });

    return (
        <>
            <AnchorTile
                {...contextMenu.triggerProps}
                {...attributes}
                {...listeners}
                ref={setNodeRef}
                href={tile.url}
                variant="outlined"
                isDragging={isDragging}
                transform={DndCss.Transform.toString(transform)}
                transition={transition}
            >
                {tile.logoUrl ? (
                    <CardMedia
                        component="img"
                        src={tile.logoUrl}
                        sx={{ height: TILE_CONTENT_HEIGHT, objectFit: 'scale-down' }}
                    />
                ) : (
                    <CardContent sx={{ height: TILE_CONTENT_HEIGHT, padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography fontSize={60} fontWeight={700}>
                            {tile.name
                                .split(' ')
                                .filter(Boolean)
                                .splice(0, 2)
                                .map(word => word[0])
                                .join('')}
                        </Typography>
                    </CardContent>
                )}
                <CardContent sx={{ 'paddingY': 0, ':last-child': { paddingBottom: 1 } }}>
                    <Typography fontSize={13} textAlign="center">{tile.name}</Typography>
                </CardContent>
            </AnchorTile>
            {contextMenu.menu}
        </>
    );
};

interface Props {
    index: number;
    parentId: string;
    tile: SpeeddialLink;
}
