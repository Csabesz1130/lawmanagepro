import { Outlet } from '@remix-run/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';

export default function IntakeRoute() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ügyfél-felvételi kezelés</h1>
      </div>

      <Tabs defaultValue="forms" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="forms">Űrlapok</TabsTrigger>
          <TabsTrigger value="submissions">Beküldések</TabsTrigger>
          <TabsTrigger value="workflows">Munkafolyamatok</TabsTrigger>
          <TabsTrigger value="reports">Jelentések</TabsTrigger>
        </TabsList>

        <TabsContent value="forms">
          {/* FormBuilder komponens ide kerül */}
        </TabsContent>

        <TabsContent value="submissions">
          {/* IntakeWorkflow komponens ide kerül */}
        </TabsContent>

        <TabsContent value="workflows">
          {/* WorkflowTemplateBuilder komponens ide kerül */}
        </TabsContent>

        <TabsContent value="reports">
          {/* IntakeReports komponens ide kerül */}
        </TabsContent>
      </Tabs>

      <Outlet />
    </div>
  );
} 