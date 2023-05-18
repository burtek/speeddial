import LinkIcon from '@mui/icons-material/Link';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Alert, Button, Dialog, DialogActions, DialogContent, IconButton, InputAdornment, TextField, Tooltip, styled } from '@mui/material';
import type { FC, MouseEventHandler } from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import type { RootState } from '@@data/index';
import { useAppDispatch } from '@@data/index';
import { getLinkEditId, linksAdapterSelectors } from '@@data/speeddial/selectors';
import { actions as speeddialActions } from '@@data/speeddial/slice';

import { useDraft } from './hooks/use-draft';
import { useFetchImageForUrl } from './hooks/use-fetch-image';
import { useFormHandlers } from './hooks/use-form-handlers';


export const PreviewImage = styled('img')(({ theme }) => ({
    float: 'right',
    gridArea: 'pic',
    objectFit: 'scale-down',
    width: '100%',
    margin: theme.spacing(1)
}));

const useErrorText = (error: ReturnType<typeof useFetchImageForUrl>['error']) => {
    const { t } = useTranslation();

    if (!error) {
        return null;
    }

    if (error.http) {
        return t([
            `errors.http.${error.http}`,
            'errors.unknown'
        ]);
    }
    if (error.logoUrl) {
        return t([
            `errors.logoUrl.${error.logoUrl}`,
            'errors.unknown'
        ]);
    }

    return t('errors.unknown');
};

export const LinkEditDialog: FC = () => {
    const { t } = useTranslation();

    const editId = useSelector(getLinkEditId) ?? 'non-existent';
    const tile = useSelector((state: RootState) => linksAdapterSelectors.selectById(state, editId));

    const dispatch = useAppDispatch();
    const onCloseWithoutSave = useCallback(() => dispatch(speeddialActions.cancelEditTile()), [dispatch]);

    const draft = useDraft(tile);

    const preventDefault = useCallback<MouseEventHandler>(event => {
        event.preventDefault();
    }, []);

    const { fetchImage, isFetching, error } = useFetchImageForUrl(
        draft.value?.url ?? '',
        url => {
            draft.set('logoUrl', url);
        }
    );

    const errorText = useErrorText(error);

    const onSave = useCallback(() => {
        if (draft.value) {
            dispatch(speeddialActions.saveEditLink(draft.value));
        }
    }, [dispatch, draft.value]);

    const formHandlers = useFormHandlers({ cancel: onCloseWithoutSave, submit: onSave });

    return (
        <Dialog open={Boolean(tile)} onClose={onCloseWithoutSave}>
            <DialogContent
                {...formHandlers}
                sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 30%',
                    gridTemplateRows: 'min-content min-content',
                    gridTemplateAreas: '"fields pic" "warn warn"'
                }}
            >
                <div style={{ gridArea: 'fields' }}>
                    <TextField
                        label={t('forms.fields.name')}
                        {...draft.inputProps('name')}
                        fullWidth
                        margin="dense"
                        variant="standard"
                        autoFocus
                        required
                    />
                    <TextField
                        label={t('forms.fields.url')}
                        {...draft.inputProps('url')}
                        fullWidth
                        margin="dense"
                        variant="standard"
                        required
                    />
                    <TextField
                        label={t('forms.fields.logoUrl')}
                        {...draft.inputProps('logoUrl')}
                        fullWidth
                        margin="dense"
                        variant="standard"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title={t('tooltips.reload_pic')}>
                                        <IconButton
                                            onClick={() => {
                                                fetchImage(false);
                                            }}
                                            onMouseDown={preventDefault}
                                            edge="end"
                                            disabled={isFetching}
                                        >
                                            <LinkIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={t('tooltips.reload_pic')}>
                                        <IconButton
                                            onClick={() => {
                                                fetchImage(true);
                                            }}
                                            onMouseDown={preventDefault}
                                            edge="end"
                                            disabled={isFetching}
                                        >
                                            <RefreshIcon />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            )
                        }}
                    />
                </div>
                <PreviewImage src={draft.value?.logoUrl} />
                {error !== null && <Alert sx={{ gridArea: 'warn' }} severity="warning">{`${errorText}. ${t('errors.adminInformed')}`}</Alert>}
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={onCloseWithoutSave}>{t('actions.cancel')}</Button>
                <Button color="primary" onClick={onSave}>{t('actions.save')}</Button>
            </DialogActions>
        </Dialog>
    );
};
