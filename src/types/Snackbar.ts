export interface SnackbarState {
  title: string;
  content: string;
  open: boolean;
  type: 'SUCCESS' | 'ERROR' | 'WARNING';
  textoCopy?: string;
}
