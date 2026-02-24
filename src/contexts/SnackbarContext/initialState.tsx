import { SnackbarState } from '../../types/Snackbar';

export const initialSnackbarState: SnackbarState = {
  title: '',
  content: '',
  open: false,
  type: 'SUCCESS',
  textoCopy: '',
};
