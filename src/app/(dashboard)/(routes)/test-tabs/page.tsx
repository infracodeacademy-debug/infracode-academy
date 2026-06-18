import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TestTabs() {
  return (
    <div className="p-10">
      <Tabs defaultValue="1" className="w-full">
        <TabsList className="bg-slate-900">
          <TabsTrigger value="1">Tab 1</TabsTrigger>
          <TabsTrigger value="2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="1">
          <div className="w-32 h-32 bg-red-500">Content 1</div>
        </TabsContent>
        <TabsContent value="2">
          <div className="w-32 h-32 bg-blue-500">Content 2</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
