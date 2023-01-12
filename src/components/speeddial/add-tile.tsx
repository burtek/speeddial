import AddIcon from '@mui/icons-material/Add';
import { Card, CardContent, Divider, IconButton, styled } from '@mui/material';
import { FolderPlus, LinkPlus } from 'mdi-material-ui';
import type { FC } from 'react';
import { useState, useCallback } from 'react';

import { useAppDispatch } from '@@data/index';
import { actions as speeddialActions, ROOT_SPEEDDIAL_ID } from '@@data/speeddial/slice';

import { TILE_WIDTH } from './components/_constants';

const AddTileWrapper = styled(Card)({
    cursor: 'pointer',
    width: TILE_WIDTH,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch'
});

const AddTileContent = styled(CardContent)({
    'display': 'flex',
    'justifyContent': 'center',
    'alignItems': 'center',
    'flexDirection': 'column',
    'padding': 0,
    '&:last-child': { padding: 0 },
    'flex': 1
});

export const AddNewTile: FC<Props> = ({ parentId }) => {
    const dispatch = useAppDispatch();

    const onAddLink = useCallback(() => {
        dispatch(speeddialActions.createLink({ parentId }));
    }, [dispatch, parentId]);
    const onAddGroup = useCallback(() => {
        dispatch(speeddialActions.createGroup());
    }, [dispatch]);

    const [isMouseOver, setIsMouseOver] = useState(false);
    const onMouseOver = useCallback(() => {
        setIsMouseOver(true);
    }, [setIsMouseOver]);
    const onMouseOut = useCallback(() => {
        setIsMouseOver(false);
    }, [setIsMouseOver]);

    const defaultContent = <AddIcon fontSize="large" htmlColor="grey" />;
    const mouseOverContent = (
        <>
            <IconButton onClick={onAddLink}>
                <LinkPlus fontSize="large" htmlColor="grey" />
            </IconButton>
            {/* eslint-disable-next-line no-warning-comments */}
            {parentId === ROOT_SPEEDDIAL_ID && ( // TODO: make universal
                <>
                    <Divider flexItem variant="middle" />
                    <IconButton onClick={onAddGroup}>
                        <FolderPlus fontSize="large" htmlColor="grey" />
                    </IconButton>
                </>
            )}
        </>
    );

    return (
        <AddTileWrapper
            variant="outlined"
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
        >
            <AddTileContent>
                {isMouseOver ? mouseOverContent : defaultContent}
            </AddTileContent>
        </AddTileWrapper>
    );
};

interface Props {
    parentId: string;
}
