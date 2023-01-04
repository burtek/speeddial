import { useSortable } from '@dnd-kit/sortable';
import { CSS as DndCss } from '@dnd-kit/utilities';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { useCallback, useMemo } from 'react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '../../data';
import { groupAdapterSelectors } from '../../data/speeddial.selectors';
import type { SpeeddialLink } from '../../data/speeddial.slice';
import { actions as speeddialActions } from '../../data/speeddial.slice';
import { useContextMenu } from './hooks/use-context-menu';

export const LinkTile: FC<Props> = ({ parentId, tile }) => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const onEdit = useCallback(() => {
        dispatch(speeddialActions.editLink({ id: tile.id }));
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
    } = useSortable({ id: tile.id });

    return (
        <>
            <Card
                {...contextMenu.triggerProps}
                {...attributes}
                {...listeners}
                ref={setNodeRef}
                component="a"
                href={tile.url}
                variant="outlined"
                sx={{
                    cursor: isDragging ? 'grabbing' : 'pointer',
                    pointerEvents: isDragging ? 'none' : undefined,
                    textDecoration: 'none',
                    transform: DndCss.Transform.toString(transform),
                    transition,
                    width: 150,
                    zIndex: isDragging ? 1 : undefined
                }}
            >
                {tile.logoUrl ? (
                    <CardMedia
                        component="img"
                        src={tile.logoUrl}
                        sx={{ height: 90, objectFit: 'scale-down' }}
                    />
                ) : (
                    <CardContent sx={{ height: 90, padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
            </Card>
            {contextMenu.menu}
        </>
    );
};

interface Props {
    parentId: string;
    tile: SpeeddialLink;
}
