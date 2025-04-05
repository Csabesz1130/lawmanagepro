import { useParams } from '@remix-run/react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { trpc } from '~/utils/trpc';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  contentType: string;
  metadata: {
    practiceArea: string;
    documentType?: string;
    tags?: string[];
    createdAt: string;
  };
}

export function KnowledgeSearch() {
  const { organizationId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    contentType: 'all',
    practiceArea: 'all',
  });

  const searchMutation = trpc.knowledge.search.query.useMutation();
  const practiceAreas = trpc.knowledge.practiceAreas.list.useQuery(
    { organizationId: organizationId! },
    { enabled: !!organizationId }
  );

  const handleSearch = async () => {
    if (!query) return;

    try {
      const results = await searchMutation.mutateAsync({
        query,
        filters: {
          contentType: filters.contentType === 'all' ? undefined : filters.contentType,
          practiceArea: filters.practiceArea === 'all' ? undefined : filters.practiceArea,
        },
      });

      console.log('Search results:', results);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Keresés..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Select
          value={filters.contentType}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, contentType: value }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tartalom típusa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Összes</SelectItem>
            <SelectItem value="article">Cikk</SelectItem>
            <SelectItem value="template">Sablon</SelectItem>
            <SelectItem value="precedent">Precedens</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.practiceArea}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, practiceArea: value }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Gyakorlati terület" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Összes</SelectItem>
            {practiceAreas.data?.map((area) => (
              <SelectItem key={area.id} value={area.id}>
                {area.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleSearch}>Keresés</Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Keresési eredmények</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {searchMutation.data?.map((result) => (
              <div
                key={result.id}
                className="rounded-lg border p-4 hover:bg-accent"
              >
                <h3 className="font-semibold">{result.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {result.contentType}
                </p>
                <p className="mt-2 text-sm">{result.content}</p>
                <div className="mt-2 flex gap-2">
                  {result.metadata.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary/10 px-2 py-1 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 