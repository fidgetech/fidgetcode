import { useRouteError } from "react-router-dom";
import { StyledPaper } from 'components/Layout/SharedStyles';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Nothing found here :(</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}