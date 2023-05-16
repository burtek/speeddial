import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import type { FC } from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import type { RootState } from '@@data/index';
import { useAppDispatch } from '@@data/index';
import { getGroupEditId, groupAdapterSelectors } from '@@data/speeddial/selectors';
import { actions as speeddialActions } from '@@data/speeddial/slice';

import { useDraft } from './hooks/use-draft';


export const GroupEditDialog: FC = () => {
    const { t } = useTranslation();

    const editId = useSelector(getGroupEditId) ?? 'non-existent';
    const tile = useSelector((state: RootState) => groupAdapterSelectors.selectById(state, editId));

    const dispatch = useAppDispatch();
    const onCloseWithoutSave = useCallback(() => dispatch(speeddialActions.cancelEditTile()), [dispatch]);

    const draft = useDraft(tile);

    const onSave = useCallback(() => {
        if (draft.value) {
            dispatch(speeddialActions.saveEditGroup(draft.value));
        }
    }, [dispatch, draft.value]);

    return (
        <Dialog open={Boolean(tile)} onClose={onCloseWithoutSave}>
            <DialogContent>
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
