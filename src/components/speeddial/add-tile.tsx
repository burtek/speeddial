import AddIcon from '@mui/icons-material/Add';
import { Card, CardContent, Divider, IconButton } from '@mui/material';
import { FolderPlus, LinkPlus } from 'mdi-material-ui';
import type { FC } from 'react';
import { useState, useCallback } from 'react';

import { useAppDispatch } from '@@data/index';
import { actions as speeddialActions, ROOT_SPEEDDIAL_ID } from '@@data/speeddial/slice';

export const AddNewTile: FC<Props> = ({ parentId }) => {
    const dispatch = useAppDispatch();

    const onAddLink = useCallback(
        () => {
            dispatch(speeddialActions.createLink({ parentId }));
        },
        [dispatch, parentId]
    );
    const onAddGroup = useCallback(
        () => {
            dispatch(speeddialActions.createGroup());
        },
        [dispatch]
    );

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
            {parentId === ROOT_SPEEDDIAL_ID && (
                <>
                    <IconButton onClick={onAddLink}>
                        <LinkPlus fontSize="large" htmlColor="grey" />
                    </IconButton>
                    <Divider flexItem variant="middle" />
                </>
            )}
            <IconButton onClick={onAddGroup}>
                <FolderPlus fontSize="large" htmlColor="grey" />
            </IconButton>
        </>
    );

    return (
        <Card
            variant="outlined"
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            sx={{ cursor: 'pointer', width: 150, display: 'flex', justifyContent: 'center', alignItems: 'stretch' }}
        >
            <CardContent
                sx={{
                    'display': 'flex',
                    'justifyContent': 'center',
                    'alignItems': 'center',
                    'flexDirection': 'column',
                    'p': 0,
                    '&:last-child': { p: 0 },
                    'flex': 1
                }}
            >
                {isMouseOver ? mouseOverContent : defaultContent}
            </CardContent>
        </Card>
    );
};

interface Props {
    parentId: string;
}
