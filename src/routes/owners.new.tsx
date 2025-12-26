import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/owners/new')({
  component: () => <Outlet />,
});
