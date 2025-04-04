import { Outlet } from '@remix-run/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { DocumentLibrary } from './DocumentLibrary';
import { KnowledgeSearch } from './KnowledgeSearch';
import { PrecedentDatabase } from './PrecedentDatabase';
import { TemplateManager } from './TemplateManager';
import { WikiEditor } from './WikiEditor';

export default function KnowledgeRoute() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tudásbázis</h1>
        <KnowledgeSearch />
      </div>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="documents">Dokumentumtár</TabsTrigger>
          <TabsTrigger value="precedents">Precedensek</TabsTrigger>
          <TabsTrigger value="wiki">Wiki</TabsTrigger>
          <TabsTrigger value="templates">Sablonok</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <DocumentLibrary />
        </TabsContent>

        <TabsContent value="precedents">
          <PrecedentDatabase />
        </TabsContent>

        <TabsContent value="wiki">
          <WikiEditor />
        </TabsContent>

        <TabsContent value="templates">
          <TemplateManager />
        </TabsContent>
      </Tabs>

      <Outlet />
    </div>
  );
} 