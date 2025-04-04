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
    DialogTitle,
} from '~/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select';
import { trpc } from '~/utils/trpc';

export function DocumentLibrary() {
  const { organizationId } = useParams();
  const [selectedDocument, setSelectedDocument] = useState<string | null>(
    null
  );
  const [filters, setFilters] = useState({
    practiceArea: 'all',
    documentType: 'all',
    sortBy: 'date',
  });

  const practiceAreas = trpc.practiceAreas.list.useQuery(
    { organizationId: organizationId! },
    { enabled: !!organizationId }
  );

  const documents = trpc.documents.list.useQuery(
    {
      organizationId: organizationId!,
      filters: {
        practiceArea:
          filters.practiceArea !== 'all' ? filters.practiceArea : undefined,
        documentType:
          filters.documentType !== 'all' ? filters.documentType : undefined,
      },
      sortBy: filters.sortBy,
    },
    { enabled: !!organizationId }
  );

  const selectedDocumentData = trpc.documents.get.useQuery(
    { id: selectedDocument! },
    { enabled: !!selectedDocument }
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
            onValueChange={(value) =>
              setFilters({ ...filters, sortBy: value })
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Rendezés" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Dátum szerint</SelectItem>
              <SelectItem value="title">Cím szerint</SelectItem>
              <SelectItem value="type">Típus szerint</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button>Új dokumentum</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {documents.data?.map((document) => (
          <Card
            key={document.id}
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => setSelectedDocument(document.id)}
          >
            <CardHeader>
              <CardTitle>{document.title}</CardTitle>
              <CardDescription>
                {document.metadata.practiceArea} • {document.documentType}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mb-4">
                {document.content.substring(0, 150)}...
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>
                  {document.metadata.author}
                </span>
                <span>
                  {new Date(document.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={!!selectedDocument}
        onOpenChange={(open) => !open && setSelectedDocument(null)}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedDocumentData.data?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedDocumentData.data && (
            <div className="space-y-6">
              <div className="flex gap-4 text-sm text-gray-500">
                <span>{selectedDocumentData.data.metadata.practiceArea}</span>
                <span>•</span>
                <span>{selectedDocumentData.data.documentType}</span>
                <span>•</span>
                <span>
                  {new Date(
                    selectedDocumentData.data.createdAt
                  ).toLocaleDateString()}
                </span>
              </div>

              <div className="prose max-w-none">
                {selectedDocumentData.data.content}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Letöltés</Button>
                <Button>Szerkesztés</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 