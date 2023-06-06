/* eslint no-warning-comments: 1 */
// TODO: refactor
import RefreshIcon from '@mui/icons-material/Refresh';
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    Popover,
    TextField,
    Tooltip,
    keyframes,
    styled
} from '@mui/material';
import type { FC, MouseEvent, SyntheticEvent } from 'react';
import { useRef, useCallback } from 'react';
import type { ColorChangeHandler } from 'react-color';
import { ChromePicker } from 'react-color';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '@@data/index';
import type { SpeeddialLink } from '@@data/speeddial/slice';
import { actions as speeddialActions } from '@@data/speeddial/slice';

import { useEditLinkTile } from './hooks/use-edit-link-tile';
import type { WebsiteData } from './hooks/use-fetch-metadata';
import { useFetchMetadataForUrl } from './hooks/use-fetch-metadata';
import { useFormHandlers } from './hooks/use-form-handlers';
import { usePopoverState } from './hooks/use-popover-state';


export const PreviewImage = styled('img')(({ theme }) => ({
    float: 'right',
    gridArea: 'pic',
    objectFit: 'scale-down',
    width: '100%',
    margin: theme.spacing(1)
}));

const SplitRow = styled('div')(({ theme }) => ({
    '& > *': { flex: '1 0 50%' },
    'display': 'flex',
    'columnGap': theme.spacing(1),
    'paddingTop': theme.spacing(1)
}));

const DialogContentStyled = styled(DialogContent)({
    display: 'grid',
    gridTemplateColumns: '1fr 30%',
    gridTemplateRows: 'min-content min-content',
    gridTemplateAreas: '"fields pic" "warn warn"'
});

const ColorPickerButtonWrapper = styled('div')({
    display: 'flex',
    alignItems: 'end'
});

const ColorPickerButton = styled(
    Button,
    { shouldForwardProp: prop => !['theme', 'currentColor'].includes(prop) }
)<{ currentColor?: string }>(({ currentColor, theme }) => ({
    backgroundColor: currentColor ?? 'transparent',
    color: theme.palette.getContrastText(currentColor ?? '#00000000'),
    flex: 1,
    marginTop: theme.spacing(2.5)
}));

const loadingAnimation = keyframes`
    0% {
        width: 0;
        margin-left: 0;
        margin-right: 17px;
        opacity: 1;
    }
    80% {
        width: 15px;
        margin-left: 2px;
        margin-right: 0;
        opacity: 1;
    }
    99% {
        width: 15px;
        margin-left: 2px;
        margin-right: 0;
        opacity: 0;
    }
    100% {
        width: 0;
        margin-left: 0;
        margin-right: 17px;
        opacity: 0;
    }
`;

const EllipsisLoader = styled('span')({
    animation: `${loadingAnimation} 1s infinite`,
    display: 'inline-block',
    overflow: 'hidden'
});

const useErrorText = (error: ReturnType<typeof useFetchMetadataForUrl>['error']) => {
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

const preventDefault = (event: SyntheticEvent) => {
    event.preventDefault();
};

const mapProps = [
    ['backgroundColor', 'backgroundColor'],
    ['themeColor', 'themeColor'],
    ['logoUrl', 'imageUrl'],
    ['name', 'title']
] satisfies [keyof SpeeddialLink, keyof WebsiteData][];

// TODO: save imageUrl as base64 option
export const LinkEditDialog: FC = () => {
    const { t } = useTranslation();

    const {
        draft: {
            inputProps: draftInputProps,
            set: draftSet,
            value: draftValue
        },
        isOpen,
        onlyShowUrl,
        showFullForm
    } = useEditLinkTile();

    const dispatch = useAppDispatch();
    const onCloseWithoutSave = useCallback(() => dispatch(speeddialActions.cancelEditTile()), [dispatch]);

    const cache = useRef(new Map<string, WebsiteData>());

    const setMetadata = useCallback((data: WebsiteData | null, url: string, { setProperty }: { setProperty: typeof mapProps[number][0] | 'all' }) => {
        if (data) {
            cache.current.set(url, data);
            cache.current.set(new URL(url).toString(), data);
            if (data.canonicalURL) {
                cache.current.set(data.canonicalURL, data);
            }
            if (data.resolvedURL) {
                cache.current.set(data.resolvedURL, data);
            }

            // FIXME: possibly setting stale data (when dialog has been reopened to another tile while fetching data)
            mapProps.forEach(([prop, key]) => {
                if ((setProperty === prop || setProperty === 'all') && data[key]) {
                    draftSet(prop, data[key]);
                }
            });
        }
    }, [draftSet]);
    const { fetchData, isFetching, error } = useFetchMetadataForUrl(draftValue?.url ?? '', setMetadata);

    const errorText = useErrorText(error);

    const onSubmitUrl = useCallback(async () => {
        await fetchData({ setProperty: 'all' });
        showFullForm();
    }, [fetchData, showFullForm]);

    const onSave = useCallback(() => {
        if (draftValue) {
            dispatch(speeddialActions.saveEditLink(draftValue));
        }
    }, [dispatch, draftValue]);

    const onReload = (prop: typeof mapProps[number][0]) => async () => {
        const data = draftValue?.url && cache.current.get(draftValue.url);
        if (data) {
            const [, key] = mapProps.find(m => m[0] === prop) as typeof mapProps[number];
            draftSet(prop, data[key]);
        } else {
            await fetchData({ setProperty: prop });
        }
    };

    const formHandlers = useFormHandlers({ cancel: onCloseWithoutSave, submit: onlyShowUrl ? onSubmitUrl : onSave });

    const [popoverState, { open: openPopover, close: closePopover }] = usePopoverState();
    const handleColorButtonClick = (mode: Parameters<typeof openPopover>[1]) => (event: MouseEvent<HTMLElement>) => {
        openPopover(event.currentTarget, mode);
    };

    const onColorChanged = useCallback<ColorChangeHandler>(({ hex }) => {
        draftSet(popoverState.mode, hex);
    }, [popoverState.mode, draftSet]);

    const makeReloadButton = (prop: typeof mapProps[number][0]) => (
        <Tooltip title={t('tooltips.reload_data')}>
            <IconButton
                onClick={onReload(prop)}
                onMouseDown={preventDefault}
                edge="end"
                disabled={isFetching}
            >
                <RefreshIcon />
            </IconButton>
        </Tooltip>
    );

    // TODO: separate component
    const renderContents = () => {
        if (onlyShowUrl) {
            return (
                <DialogContent {...formHandlers}>
                    <TextField
                        label={t('forms.fields.url')}
                        {...draftInputProps('url')}
                        fullWidth
                        margin="dense"
                        variant="standard"
                        required
                        disabled={isFetching}
                    />
                </DialogContent>
            );
        }
        return (
            <DialogContentStyled {...formHandlers}>
                <div style={{ gridArea: 'fields' }}>
                    <TextField
                        label={t('forms.fields.name')}
                        {...draftInputProps('name')}
                        fullWidth
                        margin="dense"
                        variant="standard"
                        autoFocus
                        required
                        InputProps={{ endAdornment: <InputAdornment position="end">{makeReloadButton('name')}</InputAdornment> }}
                    />
                    <TextField
                        label={t('forms.fields.url')}
                        {...draftInputProps('url')}
                        fullWidth
                        margin="dense"
                        variant="standard"
                        required
                    />
                    <TextField
                        label={t('forms.fields.logoUrl')}
                        {...draftInputProps('logoUrl')}
                        fullWidth
                        margin="dense"
                        variant="standard"
                        InputProps={{ endAdornment: <InputAdornment position="end">{makeReloadButton('logoUrl')}</InputAdornment> }}
                    />
                    <SplitRow>
                        {(['backgroundColor', 'themeColor'] as const).map(key => (
                            <FormControl key={key}>
                                <InputLabel
                                    disableAnimation
                                    htmlFor={`picker-${key}`}
                                    variant="standard"
                                    shrink
                                >
                                    {t(`forms.fields.${key}`)}
                                </InputLabel>
                                <ColorPickerButtonWrapper>
                                    <ColorPickerButton
                                        id={`picker-${key}`}
                                        currentColor={draftValue?.[key]}
                                        onClick={handleColorButtonClick(key)}
                                    >
                                        {draftValue?.[key] ?? t('forms.defaultValues.undefinedColor')}
                                    </ColorPickerButton>
                                    {makeReloadButton(key)}
                                </ColorPickerButtonWrapper>
                            </FormControl>
                        ))}
                    </SplitRow>
                    <Popover
                        open={Boolean(popoverState.anchor)}
                        anchorEl={popoverState.anchor}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                        anchorReference="anchorEl"
                        onClose={closePopover}
                    >
                        <ChromePicker
                            color={draftValue?.[popoverState.mode]}
                            onChange={onColorChanged}
                            onChangeComplete={onColorChanged}
                            disableAlpha={false}
                        />
                    </Popover>
                </div>
                <PreviewImage src={draftValue?.logoUrl} />
                {error !== null && (
                    <Alert sx={{ gridArea: 'warn' }} severity="warning">
                        {`${errorText}. ${t('errors.adminInformed')}`}
                    </Alert>
                )}
            </DialogContentStyled>
        );
    };

    return (
        <Dialog open={isOpen} onClose={onCloseWithoutSave}>
            {renderContents()}
            <DialogActions>
                <Button color="secondary" onClick={onCloseWithoutSave}>{t('actions.cancel')}</Button>
                {onlyShowUrl
                    ? (
                        <Button
                            color="primary"
                            disabled={isFetching}
                            onClick={onSubmitUrl}
                        >
                            {t('actions.next')}
                            {isFetching ? <EllipsisLoader>...</EllipsisLoader> : null}
                        </Button>
                    )
                    : (
                        <Button
                            color="primary"
                            disabled={isFetching}
                            onClick={onSave}
                        >
                            {t('actions.save')}
                        </Button>
                    )}
            </DialogActions>
        </Dialog>
    );
};
