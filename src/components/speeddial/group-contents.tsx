import { SortableContext } from '@dnd-kit/sortable';
import { Box, styled } from '@mui/material';
import type { FC } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '@@data/index';
import type { SpeeddialGroup, SpeeddialLink } from '@@data/speeddial';
import { getGroupTiles } from '@@data/speeddial/selectors';

import { AddNewTile } from './add-tile';
// eslint-disable-next-line import/no-cycle
import { GroupTile } from './tile-group';
import { LinkTile } from './tile-link';

const TilesWrapper = styled(Box)(({ theme }) => ({
    'padding': theme.spacing(3),
    'display': 'flex',
    'gap': theme.spacing(2),
    'alignItems': 'stretch',
    '& > *': { flexShrink: 0 },
    'flexWrap': 'wrap'
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

    return (
        <SortableContext id={groupId} items={tiles}>
            <TilesWrapper>
                {tiles.map(renderTile)}
                <AddNewTile parentId={groupId} />
            </TilesWrapper>
        </SortableContext>
    );
};

interface Props {
    groupId: string;
}
