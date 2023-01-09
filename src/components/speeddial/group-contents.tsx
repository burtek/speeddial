import { SortableContext } from '@dnd-kit/sortable';
import { Box } from '@mui/material';
import type { FC } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '@@data/index';
import { getGroupTiles } from '@@data/speeddial/selectors';

import { AddNewTile } from './add-tile';
// eslint-disable-next-line import/no-cycle
import { GroupTile } from './tile-group';
import { LinkTile } from './tile-link';

export const GroupContents: FC<Props> = ({ groupId }) => {
    const tiles = useSelector((state: RootState) => getGroupTiles(state, groupId));

    return (
        <SortableContext id={groupId} items={tiles}>
            <Box
                sx={{
                    'padding': '2vw',
                    'display': 'flex',
                    'gap': '1vw',
                    'alignItems': 'stretch',
                    '& > *': { flexShrink: 0 },
                    'flexWrap': 'wrap'
                }}
            >
                {tiles.map((tile, index) => {
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
                })}
                <AddNewTile parentId={groupId} />
            </Box>
        </SortableContext>
    );
};

interface Props {
    groupId: string;
}
