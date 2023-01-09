/* eslint-disable no-warning-comments */
import { CSS as DndCss } from '@dnd-kit/utilities';
import { Card, CardContent, CardMedia, Modal, Paper, Typography } from '@mui/material';
import type { FC } from 'react';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '@@data/index';
import { linksAdapterSelectors } from '@@data/speeddial/selectors';
import type { SpeeddialGroup } from '@@data/speeddial/slice';
import { actions as speeddialActions } from '@@data/speeddial/slice';

// eslint-disable-next-line import/no-cycle
import { GroupContents } from './group-contents';
import { useContextMenu } from './hooks/use-context-menu';
import { useTypedSortable } from './hooks/use-typed-sortable';

export const GroupTile: FC<Props> = ({ index, parentId, tile }) => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();
    const onEdit = useCallback(() => {
        dispatch(speeddialActions.editTile({ id: tile.id, type: 'group' }));
    }, [dispatch, tile]);
    const onDelete = useCallback(() => {
        dispatch(speeddialActions.deleteGroup({ id: tile.id }));
    }, [dispatch, tile]);

    const contextMenu = useContextMenu([
        { key: 'edit', action: onEdit, label: t('actions.edit') },
        { key: 'delete', action: onDelete, label: t('actions.delete'), requireConfirm: t('actions.delete_confirm') }
    ], tile.id);

    const links = useSelector(linksAdapterSelectors.selectEntities);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useTypedSortable({ data: { index, parentId }, id: tile.id });

    const [isOpen, setIsOpen] = useState(false);
    const onOpen = useCallback(() => {
        setIsOpen(true);
    }, []);
    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <>
            <Card
                {...contextMenu.triggerProps}
                {...attributes}
                {...listeners}
                ref={setNodeRef}
                variant="outlined"
                sx={{ width: 150, textDecoration: 'none', transform: DndCss.Transform.toString(transform), transition }}
                onClick={onOpen}
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
            <Modal open={isOpen} onClose={handleClose}>
                <Paper
                    elevation={3}
                    sx={{
                        position: 'fixed',
                        width: '60vw',
                        height: '60vh',
                        top: '50vh',
                        left: '50vw',
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <GroupContents groupId={tile.id} />
                    <div contentEditable>{tile.name}</div>
                </Paper>
            </Modal>
            {contextMenu.menu}
        </>
    );
};

interface Props {
    index: number;
    parentId: string;
    tile: SpeeddialGroup;
}
