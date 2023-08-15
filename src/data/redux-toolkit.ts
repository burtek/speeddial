import { createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import type { RootState, Store, ThunkExtraArgument } from '.';


export const useAppDispatch: () => Store['dispatch'] = useDispatch;

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: RootState;
    dispatch: Store['dispatch'];
    rejectValue: string;
    extra: ThunkExtraArgument;
}>();
