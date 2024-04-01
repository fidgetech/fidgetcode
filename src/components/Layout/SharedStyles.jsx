import { useTheme } from '@mui/system';
import { Paper } from '@mui/material';
import { paperStyle } from './LayoutStyles';


export const StyledPaper = ({ extraStyles = {}, ...props }) => {
  const theme = useTheme();
  return <Paper sx={paperStyle(theme, extraStyles)} {...props} />;
};
