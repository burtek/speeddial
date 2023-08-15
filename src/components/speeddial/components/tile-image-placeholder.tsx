import { Typography } from '@mui/material';
import { memo } from 'react';


export const TileImagePlaceholder = memo<{ name: string; fontSize?: number }>(({ name, fontSize }) => (
    <Typography fontSize={fontSize} fontWeight={700}>
        {name
            .split(' ')
            .filter(Boolean)
            .splice(0, 2)
            .map(word => word[0])
            .join('')}
    </Typography>
));
TileImagePlaceholder.displayName = 'TileImagePlaceholder';
