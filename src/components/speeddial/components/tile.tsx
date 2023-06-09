import type { Theme } from '@mui/material';
import { Card as MuiCard, styled } from '@mui/material';
import type { CardTypeMap } from '@mui/material/Card';
import type { OverridableComponent } from '@mui/material/OverridableComponent';
import type { CSSObject } from '@mui/material/styles';
import type { MUIStyledCommonProps } from '@mui/system';

import { TILE_WIDTH } from './_constants';


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

// `styled` disallows `component` overriding :(
// see https://mui.com/material-ui/guides/typescript/#complications-with-the-component-prop
export const Tile = styled<OverridableComponent<CardTypeMap<{ component?: 'a' | 'div' }, 'a' | 'div'>>>(
    MuiCard,
    { shouldForwardProp: prop => !['theme', 'isDragging', 'transform', 'transition'].includes(prop) }
)<TileProps>(styles);
