import type { Theme } from '@mui/material';
import { Card as MuiCard, styled } from '@mui/material';
import type { CardProps } from '@mui/material/Card';
import type { CSSObject } from '@mui/material/styles';
import type { MUIStyledCommonProps } from '@mui/system';
import type { FC } from 'react';

import { TILE_WIDTH } from './_constants';


const Card: FC<TileProps & Omit<CardProps, 'component'>> = ({ isDragging, transform, transition, ...props }) => <MuiCard {...props} />;
const AnchorCard: FC<TileProps & Omit<CardProps<'a', { component: 'a' }>, 'component'>> = ({
    isDragging,
    transform,
    transition,
    ...props
}) => <MuiCard {...props} component="a" />;
interface TileProps {
    isDragging: boolean;
    transform?: string;
    transition?: string;
}

const styles = ({ isDragging, transform, transition }: TileProps & MUIStyledCommonProps<Theme>): CSSObject => ({
    cursor: isDragging ? 'grabbing' : 'pointer',
    pointerEvents: isDragging ? 'none' : undefined,
    textDecoration: 'none',
    transform,
    transition,
    width: TILE_WIDTH,
    zIndex: isDragging ? 1 : undefined
});

export const Tile = styled(Card)<TileProps>(styles);
export const AnchorTile = styled(AnchorCard)<TileProps>(styles);
