/* eslint-disable no-warning-comments */
import { useSortable } from '@dnd-kit/sortable';
import { CSS as DndCss } from '@dnd-kit/utilities';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import type { FC } from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '@@data/index';
import { linksAdapterSelectors } from '@@data/speeddial/selectors';
import type { SpeeddialGroup } from '@@data/speeddial/slice';
import { actions as speeddialActions } from '@@data/speeddial/slice';

import { useContextMenu } from './hooks/use-context-menu';

export const GroupTile: FC<Props> = ({ tile }) => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();
    const onDelete = useCallback(() => {
        dispatch(speeddialActions.deleteGroup({ id: tile.id }));
    }, [dispatch, tile]);

    const contextMenu = useContextMenu([
        { key: 'delete', action: onDelete, label: t('actions.delete'), requireConfirm: t('actions.delete_confirm') }
    ], tile.id);

    const links = useSelector(linksAdapterSelectors.selectEntities);

    const {
        attributes,
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
                variant="outlined"
                sx={{ width: 150, textDecoration: 'none', transform: DndCss.Transform.toString(transform), transition }}
            >
                <CardContent
                    sx={{
                        'height': 86,
                        'padding': '2px 0',
                        'display': 'grid',
                        'justifyContent': 'center',
                        'alignItems': 'center',
                        'gridTemplateColumns': '1fr 1fr 1fr',
                        'gridTemplateRows': '40px 40px',
                        '& > img': { height: 40 }
                    }}
                >
                    {tile.children
                        .flatMap(child => links[child] ?? [])
                        .slice(0, 6)
                        // FIXME: no logo sites
                        .map(link => (
                            <CardMedia
                                key={link.id}
                                component="img"
                                src={link.logoUrl}
                                sx={{ objectFit: 'scale-down' }}
                            />
                        ))}
                </CardContent>
                <CardContent sx={{ 'paddingY': 0, ':last-child': { paddingBottom: 1 } }}>
                    <Typography fontSize={13} textAlign="center">{tile.name}</Typography>
                </CardContent>
            </Card>
            {contextMenu.menu}
        </>
    );
};

interface Props {
    tile: SpeeddialGroup;
}
