import { useBreadcrumbs } from 'contexts/BreadcrumbsContext';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';

const CustomBreadcrumbs = () => {
  const { breadcrumbs } = useBreadcrumbs();

  if (!breadcrumbs.length) return null;

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, pb: 1 }}>
      <Breadcrumbs aria-label="breadcrumb">
        {breadcrumbs.map((crumb, index) => (
          index < breadcrumbs.length - 1 ? (
            <Link key={crumb.path} href={crumb.path}>
              {crumb.label}
            </Link>
          ) : (
            <Typography key={crumb.path} color="textPrimary">
              {crumb.label}
            </Typography>
          )
        ))}
      </Breadcrumbs>
    </Box>
  );
};

export default CustomBreadcrumbs;
