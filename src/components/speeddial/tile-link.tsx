import { CSS as DndCss } from '@dnd-kit/utilities';
import { CardContent, CardMedia, Typography, styled } from '@mui/material';
import type { FC } from 'react';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '@@data/index';
import { groupAdapterSelectors } from '@@data/speeddial/selectors';
import type { SpeeddialLink } from '@@data/speeddial/slice';
import { actions as speeddialActions } from '@@data/speeddial/slice';

import { TILE_CONTENT_HEIGHT } from './components/_constants';
import { Tile } from './components/tile';
import { useContextMenu } from './hooks/use-context-menu';
import { useTypedSortable } from './hooks/use-typed-sortable';


const StyledCardContent = styled(CardContent)({
    height: TILE_CONTENT_HEIGHT,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
});
const TileTitle = styled(
    CardContent,
    { shouldForwardProp: prop => !['theme', 'backgroundColor'].includes(prop) }
)<{ backgroundColor?: string }>(({ backgroundColor, theme }) => ({
    ':last-child': { padding: theme.spacing(0.75) },
    'backgroundColor': backgroundColor ?? 'transparent',
    'color': theme.palette.getContrastText(backgroundColor ?? '#00000000'),
    'display': 'flex',
    'alignItems': 'center',
    'justifyContent': 'center'
}));

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
            <Tile
                {...contextMenu.triggerProps}
                {...attributes}
                {...listeners}
                component="a"
                ref={setNodeRef}
                href={tile.url}
                variant="outlined"
                isDragging={isDragging}
                transform={DndCss.Transform.toString(transform)}
                transition={transition}
            >
                {tile.logoUrl
                    ? (
                        <CardMedia
                            component="img"
                            src={tile.logoUrl}
                            sx={{
                                backgroundColor: tile.backgroundColor ?? 'transparent',
                                height: TILE_CONTENT_HEIGHT,
                                objectFit: 'scale-down'
                            }}
                        />
                    )
                    : (
                        <StyledCardContent>
                            <Typography fontSize={60} fontWeight={700}>
                                {tile.name
                                    .split(' ')
                                    .filter(Boolean)
                                    .splice(0, 2)
                                    .map(word => word[0])
                                    .join('')}
                            </Typography>
                        </StyledCardContent>
                    )}
                <TileTitle backgroundColor={tile.themeColor}>
                    <Typography fontSize={13}>{tile.name}</Typography>
                </TileTitle>
            </Tile>
            {contextMenu.menu}
        </>
    );
};

interface Props {
    index: number;
    parentId: string;
    tile: SpeeddialLink;
}
