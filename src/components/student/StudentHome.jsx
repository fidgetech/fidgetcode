import { Courses } from './Courses';
import { useEffect } from 'react';
import { useBreadcrumbs } from 'contexts/BreadcrumbsContext';

export const StudentHome = () => {
  const { setBreadcrumbs } = useBreadcrumbs();
  useEffect(() => {
    setBreadcrumbs([]);
  }, [setBreadcrumbs]);

  return (
    <Courses />
  );
};
