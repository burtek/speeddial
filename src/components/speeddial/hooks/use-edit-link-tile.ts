// import LinkIcon from '@mui/icons-material/Link';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '@@data/index';
import { getLinkEditTile, linksAdapterSelectors } from '@@data/speeddial/selectors';

import { useDraft } from './use-draft';


export const useEditLinkTile = () => {
    const editTileState = useSelector(getLinkEditTile);
    const tile = useSelector((state: RootState) => linksAdapterSelectors.selectById(state, editTileState?.id ?? ''));

    const [onlyShowUrl, setOnlyShowUrl] = useState(false);
    useEffect(() => {
        if (tile) {
            setOnlyShowUrl(Boolean(editTileState?.createMode));
        } else {
            setOnlyShowUrl(false);
        }
    }, [tile]);

    return {
        draft: useDraft(tile),
        isOpen: Boolean(tile),
        onlyShowUrl,
        showFullForm: useCallback(() => {
            setOnlyShowUrl(false);
        }, [])
    };
};
