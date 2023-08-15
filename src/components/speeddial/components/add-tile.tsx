import AddIcon from '@mui/icons-material/Add';
import { Card, CardContent, Divider, IconButton, styled } from '@mui/material';
import { FolderPlus, LinkPlus } from 'mdi-material-ui';
import type { FC } from 'react';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { TILE_WIDTH } from './_constants';


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

export const AddNewTile: FC<Props> = ({ onAddGroup, onAddLink }) => {
    const { t } = useTranslation();

    const [isMouseOver, setIsMouseOver] = useState(false);
    const onMouseOver = useCallback(() => {
        setIsMouseOver(true);
    }, [setIsMouseOver]);
    const onMouseOut = useCallback(() => {
        setIsMouseOver(false);
    }, [setIsMouseOver]);

    const defaultContent = (
        <AddIcon
            aria-label={onAddGroup ? t('tooltips.add_link_or_group') : t('tooltips.add_link')}
            fontSize="large"
            htmlColor="grey"
        />
    );
    const mouseOverContent = (
        <>
            <IconButton
                aria-label={t('tooltips.add_link')}
                onClick={onAddLink}
                title={t('tooltips.add_link')}
            >
                <LinkPlus fontSize="large" htmlColor="grey" />
            </IconButton>
            {onAddGroup
                ? (
                    <>
                        <Divider flexItem variant="middle" />
                        <IconButton
                            aria-label={t('tooltips.add_group')}
                            onClick={onAddGroup}
                            title={t('tooltips.add_group')}
                        >
                            <FolderPlus fontSize="large" htmlColor="grey" />
                        </IconButton>
                    </>
                )
                : null}
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
    onAddGroup?: () => void;
    onAddLink: () => void;
}
