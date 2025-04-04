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
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
import { trpc } from '~/utils/trpc';

interface Article {
  id: string;
  title: string;
  content: string;
  practiceAreaId: string;
  tags: string[];
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export function WikiEditor() {
  const { organizationId } = useParams();
  const [selectedArticle, setSelectedArticle] = useState<string | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Article>>({});

  const practiceAreas = trpc.practiceAreas.list.useQuery(
    { organizationId: organizationId! },
    { enabled: !!organizationId }
  );

  const articles = trpc.knowledgeArticles.list.useQuery(
    { organizationId: organizationId! },
    { enabled: !!organizationId }
  );

  const selectedArticleData = trpc.knowledgeArticles.get.useQuery(
    { id: selectedArticle! },
    { enabled: !!selectedArticle }
  );

  const createArticle = trpc.knowledgeArticles.create.useMutation();
  const updateArticle = trpc.knowledgeArticles.update.useMutation();

  const handleSave = async () => {
    if (selectedArticle) {
      await updateArticle.mutateAsync({
        id: selectedArticle,
        ...editData,
      });
    } else {
      await createArticle.mutateAsync({
        organizationId: organizationId!,
        ...editData,
      });
    }
    setIsEditing(false);
    setEditData({});
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Select>
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

        <Button onClick={() => {
          setSelectedArticle(null);
          setIsEditing(true);
          setEditData({});
        }}>
          Új cikk
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {articles.data?.map((article) => (
          <Card
            key={article.id}
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => setSelectedArticle(article.id)}
          >
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
              <CardDescription>
                {article.tags.join(', ')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mb-4">
                {article.content.substring(0, 150)}...
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>
                  Megtekintve: {article.viewCount}x
                </span>
                <span>
                  {new Date(article.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={!!selectedArticle || isEditing}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedArticle(null);
            setIsEditing(false);
            setEditData({});
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing
                ? selectedArticle
                  ? 'Cikk szerkesztése'
                  : 'Új cikk'
                : selectedArticleData.data?.title}
            </DialogTitle>
          </DialogHeader>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label>Cím</Label>
                <Input
                  value={editData.title || ''}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Szakterület</Label>
                <Select
                  value={editData.practiceAreaId}
                  onValueChange={(value) =>
                    setEditData({ ...editData, practiceAreaId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Válassz szakterületet" />
                  </SelectTrigger>
                  <SelectContent>
                    {practiceAreas.data?.map((area) => (
                      <SelectItem key={area.id} value={area.id}>
                        {area.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Címkék (vesszővel elválasztva)</Label>
                <Input
                  value={editData.tags?.join(', ') || ''}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      tags: e.target.value.split(',').map((t) => t.trim()),
                    })
                  }
                />
              </div>

              <div>
                <Label>Tartalom</Label>
                <Textarea
                  className="min-h-[400px]"
                  value={editData.content || ''}
                  onChange={(e) =>
                    setEditData({ ...editData, content: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditData({});
                  }}
                >
                  Mégse
                </Button>
                <Button onClick={handleSave}>Mentés</Button>
              </div>
            </div>
          ) : (
            selectedArticleData.data && (
              <div className="space-y-6">
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>
                    {selectedArticleData.data.tags.join(', ')}
                  </span>
                  <span>•</span>
                  <span>
                    {new Date(
                      selectedArticleData.data.updatedAt
                    ).toLocaleDateString()}
                  </span>
                </div>

                <div className="prose max-w-none">
                  {selectedArticleData.data.content}
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      setIsEditing(true);
                      setEditData(selectedArticleData.data);
                    }}
                  >
                    Szerkesztés
                  </Button>
                </div>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 