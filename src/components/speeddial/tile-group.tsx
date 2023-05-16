import { CSS as DndCss } from '@dnd-kit/utilities';
import { CardContent, CardMedia, Modal, Paper, Typography, styled, Input } from '@mui/material';
import type { ChangeEventHandler, FC } from 'react';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '@@data/index';
import { linksAdapterSelectors } from '@@data/speeddial/selectors';
import type { SpeeddialGroup } from '@@data/speeddial/slice';
import { actions as speeddialActions } from '@@data/speeddial/slice';

import { TILE_CONTENT_HEIGHT } from './components/_constants';
import { Tile } from './components/tile';
import { GroupContents } from './group-contents';
import { useContextMenu } from './hooks/use-context-menu';
import { useTypedSortable } from './hooks/use-typed-sortable';


const TileContent = styled(CardContent)({
    'boxSizing': 'border-box',
    'height': TILE_CONTENT_HEIGHT,
    'padding': '2px 0',
    'display': 'grid',
    'justifyContent': 'center',
    'alignItems': 'center',
    'gridTemplateColumns': 'repeat(3, 1fr)',
    'gridTemplateRows': '40px 40px',
    '& > img': { height: 40 }
});
const ModalContent = styled(Paper)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'fixed',
    width: '60vw',
    height: '60vh',
    top: '50vh',
    left: '50vw',
    transform: 'translate(-50%, -50%)'
});
const GroupNameInput = styled(Input)(({ theme }) => ({
    'margin': theme.spacing(1),
    '& input': { textAlign: 'center' }
}));

const SHOW_SUBTILES = 6;

export const GroupTile: FC<Props> = ({ index, parentId, tile }) => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();
    const onEdit = useCallback(() => {
        dispatch(speeddialActions.editTile({ id: tile.id, type: 'group' }));
    }, [dispatch, tile.id]);
    const onDelete = useCallback(() => {
        dispatch(speeddialActions.deleteGroup({ id: tile.id }));
    }, [dispatch, tile.id]);
    const onNameChange = useCallback<ChangeEventHandler<HTMLInputElement>>(event => {
        dispatch(speeddialActions.renameGroup(tile.id, event.target.value));
    }, [dispatch, tile.id]);

    const contextMenu = useContextMenu([
        { key: 'edit', action: onEdit, label: t('actions.edit') },
        { key: 'delete', action: onDelete, label: t('actions.delete'), requireConfirm: t('actions.delete_confirm') }
    ], tile.id);

    const links = useSelector(linksAdapterSelectors.selectEntities);

    const {
        attributes,
        isDragging,
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
            <Tile
                {...contextMenu.triggerProps}
                {...attributes}
                {...listeners}
                ref={setNodeRef}
                onClick={onOpen}
                variant="outlined"
                isDragging={isDragging}
                transform={DndCss.Transform.toString(transform)}
                transition={transition}
            >
                <TileContent>
                    {tile.children
                        .flatMap(child => links[child] ?? [])
                        .slice(0, SHOW_SUBTILES)
                        // FIXME: no logo sites
                        .map(link => (
                            <CardMedia
                                key={link.id}
                                component="img"
                                src={link.logoUrl}
                                sx={{ objectFit: 'scale-down' }}
                            />
                        ))}
                </TileContent>
                <CardContent sx={{ 'paddingY': 0, ':last-child': { paddingBottom: 1 } }}>
                    <Typography fontSize={13} textAlign="center">{tile.name}</Typography>
                </CardContent>
            </Tile>
            <Modal open={isOpen} onClose={handleClose}>
                <ModalContent elevation={3}>
                    <GroupContents groupId={tile.id} />
                    <GroupNameInput
                        value={tile.name}
                        onChange={onNameChange}
                        disableUnderline
                        fullWidth
                    />
                </ModalContent>
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
