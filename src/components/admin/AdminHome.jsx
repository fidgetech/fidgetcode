import { Link as RouterLink } from "react-router-dom";
import { Typography, Link } from "@mui/material";
export const AdminHome = () => {
  return (
    <Typography variant='h6'>
      <Link component={RouterLink} to="/admin/invite">Invite Student</Link>
    </Typography>
  );
}
