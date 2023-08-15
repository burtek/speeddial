/* eslint-disable import/no-cycle -- FIXME */
import { SortableContext } from '@dnd-kit/sortable';
import { Box, styled } from '@mui/material';
import type { FC } from 'react';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '@@data/index';
import { useAppDispatch } from '@@data/redux-toolkit';
import type { SpeeddialGroup, SpeeddialLink } from '@@data/speeddial';
import { ROOT_SPEEDDIAL_ID, actions as speeddialActions } from '@@data/speeddial';
import { getGroupTiles } from '@@data/speeddial/selectors';

import { AddNewTile } from './components/add-tile';
import { GroupTile } from './tile-group';
import { LinkTile } from './tile-link';


const TilesWrapper = styled(Box)(({ theme }) => ({
    'padding': theme.spacing(3),
    'display': 'flex',
    'gap': theme.spacing(2),
    'alignItems': 'stretch',
    '& > *': { flexShrink: 0 },
    'flexWrap': 'wrap',
    'userSelect': 'none'
}));

export const GroupContents: FC<Props> = ({ groupId }) => {
    const tiles = useSelector((state: RootState) => getGroupTiles(state, groupId));

    const renderTile = (tile: SpeeddialGroup | SpeeddialLink, index: number) => {
        switch (tile.type) {
            case 'link':
                return (
                    <LinkTile
                        key={tile.id}
                        index={index}
                        parentId={groupId}
                        tile={tile}
                    />
                );
            case 'group':
                return (
                    <GroupTile
                        key={tile.id}
                        index={index}
                        parentId={groupId}
                        tile={tile}
                    />
                );
            default:
                return null;
        }
    };

    const dispatch = useAppDispatch();
    const onAddLink = useCallback(() => {
        dispatch(speeddialActions.createLink({ parentId: groupId }));
    }, [dispatch, groupId]);
    const onAddGroup = useMemo<undefined | (() => void)>(() => {
        if (groupId === ROOT_SPEEDDIAL_ID) {
            return () => dispatch(speeddialActions.createGroup());
        }
        return undefined;
    }, [dispatch, groupId]);

    return (
        <SortableContext id={groupId} items={tiles}>
            <TilesWrapper data-group-content>
                {tiles.map(renderTile)}
                <AddNewTile onAddLink={onAddLink} onAddGroup={onAddGroup} />
            </TilesWrapper>
        </SortableContext>
    );
};

interface Props {
    groupId: string;
}
