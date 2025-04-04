import { useParams } from '@remix-run/react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '~/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '~/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select';
import { trpc } from '~/utils/trpc';

interface PrecedentFilters {
  practiceArea: string;
  documentType: string;
  sortBy: 'date' | 'usage' | 'success';
}

export function PrecedentDatabase() {
  const { organizationId } = useParams();
  const [filters, setFilters] = useState<PrecedentFilters>({
    practiceArea: 'all',
    documentType: 'all',
    sortBy: 'date',
  });
  const [selectedPrecedent, setSelectedPrecedent] = useState<string | null>(
    null
  );

  const practiceAreas = trpc.practiceAreas.list.useQuery(
    { organizationId: organizationId! },
    { enabled: !!organizationId }
  );

  const precedents = trpc.precedents.list.useQuery(
    {
      organizationId: organizationId!,
      filters: {
        practiceArea: filters.practiceArea !== 'all' ? filters.practiceArea : undefined,
        documentType: filters.documentType !== 'all' ? filters.documentType : undefined,
      },
      sortBy: filters.sortBy,
    },
    { enabled: !!organizationId }
  );

  const selectedPrecedentData = trpc.precedents.get.useQuery(
    { id: selectedPrecedent! },
    { enabled: !!selectedPrecedent }
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
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

          <Select
            value={filters.documentType}
            onValueChange={(value) =>
              setFilters({ ...filters, documentType: value })
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Dokumentum típus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Minden típus</SelectItem>
              <SelectItem value="contract">Szerződés</SelectItem>
              <SelectItem value="motion">Beadvány</SelectItem>
              <SelectItem value="opinion">Jogi vélemény</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.sortBy}
            onValueChange={(value: PrecedentFilters['sortBy']) =>
              setFilters({ ...filters, sortBy: value })
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Rendezés" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Dátum szerint</SelectItem>
              <SelectItem value="usage">Használat szerint</SelectItem>
              <SelectItem value="success">Sikeresség szerint</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button>Új precedens</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {precedents.data?.map((precedent) => (
          <Card
            key={precedent.id}
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => setSelectedPrecedent(precedent.id)}
          >
            <CardHeader>
              <CardTitle>{precedent.title}</CardTitle>
              <CardDescription>
                {precedent.metadata.practiceArea} • {precedent.documentType}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mb-4">
                {precedent.content.substring(0, 150)}...
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>
                  Használva: {precedent.usageCount}x
                </span>
                {precedent.successRate && (
                  <span>
                    Sikeresség: {Math.round(precedent.successRate * 100)}%
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={!!selectedPrecedent}
        onOpenChange={(open) => !open && setSelectedPrecedent(null)}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPrecedentData.data?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedPrecedentData.data && (
            <div className="space-y-6">
              <div className="flex gap-4 text-sm text-gray-500">
                <span>{selectedPrecedentData.data.metadata.practiceArea}</span>
                <span>•</span>
                <span>{selectedPrecedentData.data.documentType}</span>
                <span>•</span>
                <span>
                  {new Date(
                    selectedPrecedentData.data.createdAt
                  ).toLocaleDateString()}
                </span>
              </div>

              <div className="prose max-w-none">
                {selectedPrecedentData.data.content}
              </div>

              {selectedPrecedentData.data.citations?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Hivatkozások</h3>
                  <ul className="list-disc pl-5">
                    {selectedPrecedentData.data.citations.map((citation) => (
                      <li key={citation.id}>
                        {citation.citation}
                        <p className="text-sm text-gray-600 mt-1">
                          {citation.context}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedPrecedentData.data.relatedPrecedents?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Kapcsolódó precedensek
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedPrecedentData.data.relatedPrecedents.map(
                      (related) => (
                        <Card
                          key={related.id}
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => setSelectedPrecedent(related.id)}
                        >
                          <CardHeader>
                            <CardTitle>{related.title}</CardTitle>
                            <CardDescription>
                              {related.metadata.practiceArea} •{' '}
                              {related.documentType}
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 