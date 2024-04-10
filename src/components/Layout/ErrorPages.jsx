import { useRouteError, Link as RouterLink } from "react-router-dom";
import { Typography, Link } from "@mui/material";
import MaterialLayout from "components/Layout/MaterialLayout";

export const RoutingErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <MaterialLayout>
      <div id="error-page">
        <h1>Oops!</h1>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </MaterialLayout>
  );
}

export const PermissionsErrorPage = () => {
  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <Typography>
        You do not have permission to view this page.<br />
        Return to <Link component={RouterLink} to='/'>home page</Link>?
      </Typography>
    </div>
  );
}
