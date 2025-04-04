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

  const searchMutation = trpc.search.query.useMutation();
  const practiceAreas = trpc.practiceAreas.list.useQuery(
    { organizationId: organizationId! },
    { enabled: !!organizationId }
  );

  const handleSearch = async () => {
    if (!query) return;

    const searchFilters: Record<string, string> = {};
    if (filters.contentType !== 'all') {
      searchFilters.contentType = filters.contentType;
    }
    if (filters.practiceArea !== 'all') {
      searchFilters['metadata.practiceArea'] = filters.practiceArea;
    }

    await searchMutation.mutateAsync({
      query,
      filters: searchFilters,
    });
  };

  const renderResult = (result: SearchResult) => {
    const icon = {
      article: '📄',
      precedent: '⚖️',
      template: '📋',
    }[result.contentType];

    return (
      <div
        key={result.id}
        className="p-4 border rounded-lg mb-4 hover:bg-gray-50 cursor-pointer"
        onClick={() => {
          // Navigate to result
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span>{icon}</span>
          <h3 className="font-semibold">{result.title}</h3>
        </div>
        <p className="text-sm text-gray-600 mb-2">{result.content}</p>
        <div className="flex gap-2 text-xs text-gray-500">
          <span>{result.metadata.practiceArea}</span>
          {result.metadata.documentType && (
            <>
              <span>•</span>
              <span>{result.metadata.documentType}</span>
            </>
          )}
          <span>•</span>
          <span>
            {new Date(result.metadata.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex gap-2">
        <Input
          type="search"
          placeholder="Keresés a tudásbázisban..."
          className="w-96"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setIsOpen(true);
              handleSearch();
            }
          }}
        />
        <Button
          variant="outline"
          onClick={() => {
            setIsOpen(true);
            handleSearch();
          }}
        >
          Keresés
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Keresési eredmények</DialogTitle>
          </DialogHeader>

          <div className="flex gap-4 mb-4">
            <Select
              value={filters.contentType}
              onValueChange={(value) =>
                setFilters({ ...filters, contentType: value })
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tartalom típusa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Minden típus</SelectItem>
                <SelectItem value="article">Wiki cikkek</SelectItem>
                <SelectItem value="precedent">Precedensek</SelectItem>
                <SelectItem value="template">Sablonok</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.practiceArea}
              onValueChange={(value) =>
                setFilters({ ...filters, practiceArea: value })
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Szakterület" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Minden szakterület</SelectItem>
                {practiceAreas.data?.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {searchMutation.isLoading ? (
              <div className="text-center py-8">Keresés...</div>
            ) : searchMutation.data?.length === 0 ? (
              <div className="text-center py-8">
                Nincs találat a keresési feltételekre.
              </div>
            ) : (
              searchMutation.data?.map(renderResult)
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 