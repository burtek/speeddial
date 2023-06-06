import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import type { FC } from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import type { RootState } from '@@data/index';
import { useAppDispatch } from '@@data/index';
import { getGroupEditTile, groupAdapterSelectors } from '@@data/speeddial/selectors';
import { actions as speeddialActions } from '@@data/speeddial/slice';

import { useDraft } from './hooks/use-draft';
import { useFormHandlers } from './hooks/use-form-handlers';


export const GroupEditDialog: FC = () => {
    const { t } = useTranslation();

    const editTileState = useSelector(getGroupEditTile);
    const tile = useSelector((state: RootState) => groupAdapterSelectors.selectById(state, editTileState?.id ?? ''));

    const dispatch = useAppDispatch();
    const onCloseWithoutSave = useCallback(() => dispatch(speeddialActions.cancelEditTile()), [dispatch]);

    const draft = useDraft(tile);

    const onSave = useCallback(() => {
        if (draft.value) {
            dispatch(speeddialActions.saveEditGroup(draft.value));
        }
    }, [dispatch, draft.value]);

    const formHandlers = useFormHandlers({ cancel: onCloseWithoutSave, submit: onSave });

    return (
        <Dialog open={Boolean(tile)} onClose={onCloseWithoutSave}>
            <DialogContent {...formHandlers}>
                <TextField
                    label={t('forms.fields.name')}
                    {...draft.inputProps('name')}
                    fullWidth
                    margin="dense"
                    variant="standard"
                    autoFocus
                    required
                />
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={onCloseWithoutSave}>{t('actions.cancel')}</Button>
                <Button color="primary" onClick={onSave}>{t('actions.save')}</Button>
            </DialogActions>
        </Dialog>
    );
};
