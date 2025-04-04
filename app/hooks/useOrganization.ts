import { useParams } from '@remix-run/react';
import { Api } from '~/core/trpc';

export function useOrganization() {
  const { organizationId } = useParams();
  const { data: organization } = Api.organization.findUnique.useQuery({
    where: { id: organizationId },
  });

  return { organization };
} 