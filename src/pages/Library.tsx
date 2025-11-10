import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";
import { LibraryResource, ResourceType } from "@/types";

const Library = () => {
  const [activeTab, setActiveTab] = useState("books");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] =
    useState<LibraryResource | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toast } = useToast();

  // Mock data - will be replaced with actual data from Supabase
  const [resources, setResources] = useState<LibraryResource[]>([
    {
      id: "1",
      title: "تفسير ابن كثير",
      author: "ابن كثير الدمشقي",
      description: "تفسير كامل للقرآن الكريم من أشهر كتب التفسير بالمأثور",
      type: "PDF",
      category: "تفسير",
      url: "https://example.com/ibn-kathir.pdf",
      isActive: true,
      createdAt: new Date("2025-09-01"),
    },
    {
      id: "2",
      title: "صحيح البخاري",
      author: "الإمام البخاري",
      description: "أصحح كتب الحديث النبوي بعد القرآن الكريم",
      type: "PDF",
      category: "حديث",
      url: "https://example.com/bukhari.pdf",
      isActive: true,
      createdAt: new Date("2025-09-05"),
    },
    {
      id: "3",
      title: "دروس في التجويد",
      author: "الشيخ محمد محمود",
      description: "سلسلة دروس صوتية في أحكام التجويد",
      type: "صوت",
      category: "تجويد",
      url: "https://example.com/tajweed-lessons.mp3",
      isActive: true,
      createdAt: new Date("2025-09-10"),
    },
    {
      id: "4",
      title: "سيرة النبي صلى الله عليه وسلم",
      author: "ابن هشام",
      description: "سيرة نبوية شاملة من مصادر موثوقة",
      type: "فيديو",
      category: "سيرة",
      url: "https://example.com/seerah-video.mp4",
      isActive: true,
      createdAt: new Date("2025-09-15"),
    },
    {
      id: "5",
      title: "موسوعة الفقه الإسلامي",
      author: "مجموعة من العلماء",
      description: "موسوعة شاملة في الفقه الإسلامي وأدلته",
      type: "رابط",
      category: "فقه",
      url: "https://example.com/islamic-fiqh-encyclopedia.com",
      isActive: true,
      createdAt: new Date("2025-09-20"),
    },
    {
      id: "6",
      title: "شرح الأربعين النووية",
      author: "الشيخ عبد الله بن جبرين",
      description: "شرح مفصل للأحاديث الأربعين النووية",
      type: "صوت",
      category: "حديث",
      url: "https://example.com/arbaeen-explanation.mp3",
      isActive: true,
      createdAt: new Date("2025-10-01"),
    },
    {
      id: "7",
      title: "العقيدة الطحاوية",
      author: "ابن أبي العز الحنفي",
      description: "من أهم متون العقيدة السلفية",
      type: "PDF",
      category: "عقيدة",
      url: "https://example.com/tahawiyyah.pdf",
      isActive: true,
      createdAt: new Date("2025-10-05"),
    },
    {
      id: "8",
      title: "دروس في أصول الفقه",
      author: "الشيخ محمد العثيمين",
      description: "سلسلة دروس في أصول الفقه الإسلامي",
      type: "فيديو",
      category: "أصول الفقه",
      url: "https://example.com/usul-fiqh.mp4",
      isActive: true,
      createdAt: new Date("2025-10-10"),
    },
  ]);

  // Form state
  const [newResource, setNewResource] = useState<Partial<LibraryResource>>({
    title: "",
    author: "",
    description: "",
    type: "PDF",
    category: "",
    url: "",
    isActive: true,
  });

  const categories = [
    "all",
    "تفسير",
    "حديث",
    "فقه",
    "عقيدة",
    "سيرة",
    "تجويد",
    "أصول الفقه",
    "أخلاق",
    "تاريخ الإسلام",
  ];

  const getTypeColor = (type: ResourceType) => {
    switch (type) {
      case "PDF":
        return "bg-red-100 text-red-800";
      case "صوت":
        return "bg-blue-100 text-blue-800";
      case "فيديو":
        return "bg-green-100 text-green-800";
      case "رابط":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: ResourceType) => {
    switch (type) {
      case "PDF":
        return "📄";
      case "صوت":
        return "🎵";
      case "فيديو":
        return "🎥";
      case "رابط":
        return "🔗";
      default:
        return "📄";
    }
  };

  // CRUD functions
  const handleAddResource = () => {
    if (!newResource.title || !newResource.type || !newResource.category) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const resource: LibraryResource = {
      id: Date.now().toString(),
      title: newResource.title || "",
      author: newResource.author,
      description: newResource.description,
      type: newResource.type as ResourceType,
      category: newResource.category || "",
      url: newResource.url,
      isActive: newResource.isActive || true,
      createdAt: new Date(),
    };

    setResources([...resources, resource]);
    setNewResource({
      title: "",
      author: "",
      description: "",
      type: "PDF",
      category: "",
      url: "",
      isActive: true,
    });
    setIsAddDialogOpen(false);
    toast({
      title: "تم الإضافة",
      description: "تم إضافة المورد بنجاح",
    });
  };

  const handleEditResource = () => {
    if (
      !selectedResource ||
      !newResource.title ||
      !newResource.type ||
      !newResource.category
    ) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setResources(
      resources.map((resource) =>
        resource.id === selectedResource.id
          ? {
              ...resource,
              title: newResource.title || resource.title,
              author: newResource.author || resource.author,
              description: newResource.description || resource.description,
              type: (newResource.type as ResourceType) || resource.type,
              category: newResource.category || resource.category,
              url: newResource.url || resource.url,
              isActive:
                newResource.isActive !== undefined
                  ? newResource.isActive
                  : resource.isActive,
            }
          : resource
      )
    );

    setIsEditDialogOpen(false);
    setSelectedResource(null);
    setNewResource({
      title: "",
      author: "",
      description: "",
      type: "PDF",
      category: "",
      url: "",
      isActive: true,
    });
    toast({
      title: "تم التعديل",
      description: "تم تعديل المورد بنجاح",
    });
  };

  const handleDeleteResource = () => {
    if (!selectedResource) return;

    setResources(
      resources.filter((resource) => resource.id !== selectedResource.id)
    );
    setIsDeleteDialogOpen(false);
    setSelectedResource(null);
    toast({
      title: "تم الحذف",
      description: "تم حذف المورد بنجاح",
    });
  };

  const openEditDialog = (resource: LibraryResource) => {
    setSelectedResource(resource);
    setNewResource({
      title: resource.title,
      author: resource.author,
      description: resource.description,
      type: resource.type,
      category: resource.category,
      url: resource.url,
      isActive: resource.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (resource: LibraryResource) => {
    setSelectedResource(resource);
    setIsDeleteDialogOpen(true);
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getResourcesByType = (type: ResourceType) => {
    return filteredResources.filter((resource) => resource.type === type);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="المكتبة العلمية" showBack={true} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">🧭 المكتبة العلمية</h2>
          <p className="text-muted-foreground mb-6">
            كتب PDF، مقاطع صوتية للعلماء، روابط موثوقة للمراجع الشرعية
          </p>

          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4 space-x-reverse">
              <Input
                placeholder="البحث في المكتبة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="جميع الفئات" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "جميع الفئات" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground">
                  إضافة مورد جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>إضافة مورد جديد</DialogTitle>
                  <DialogDescription>
                    أدخل بيانات المورد الجديد للمكتبة
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      العنوان
                    </Label>
                    <Input
                      id="title"
                      value={newResource.title}
                      onChange={(e) =>
                        setNewResource({
                          ...newResource,
                          title: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="author" className="text-right">
                      المؤلف
                    </Label>
                    <Input
                      id="author"
                      value={newResource.author}
                      onChange={(e) =>
                        setNewResource({
                          ...newResource,
                          author: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      النوع
                    </Label>
                    <Select
                      value={newResource.type}
                      onValueChange={(value) =>
                        setNewResource({
                          ...newResource,
                          type: value as ResourceType,
                        })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PDF">PDF</SelectItem>
                        <SelectItem value="صوت">صوت</SelectItem>
                        <SelectItem value="فيديو">فيديو</SelectItem>
                        <SelectItem value="رابط">رابط</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      الفئة
                    </Label>
                    <Select
                      value={newResource.category}
                      onValueChange={(value) =>
                        setNewResource({ ...newResource, category: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="اختر الفئة" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories
                          .filter((c) => c !== "all")
                          .map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      الوصف
                    </Label>
                    <Textarea
                      id="description"
                      value={newResource.description}
                      onChange={(e) =>
                        setNewResource({
                          ...newResource,
                          description: e.target.value,
                        })
                      }
                      className="col-span-3"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="url" className="text-right">
                      الرابط
                    </Label>
                    <Input
                      id="url"
                      value={newResource.url}
                      onChange={(e) =>
                        setNewResource({ ...newResource, url: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    إلغاء
                  </Button>
                  <Button onClick={handleAddResource}>إضافة مورد</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="books">الكتب PDF</TabsTrigger>
            <TabsTrigger value="audio">المقاطع الصوتية</TabsTrigger>
            <TabsTrigger value="video">الفيديوهات</TabsTrigger>
            <TabsTrigger value="links">الروابط الموثوقة</TabsTrigger>
            <TabsTrigger value="all">جميع الموارد</TabsTrigger>
          </TabsList>

          <TabsContent value="books" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getResourcesByType("PDF").map((resource) => (
                <Card
                  key={resource.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="text-2xl">📄</span>
                        <CardTitle className="text-lg">
                          {resource.title}
                        </CardTitle>
                      </div>
                      <Badge className={getTypeColor(resource.type)}>
                        {resource.type}
                      </Badge>
                    </div>
                    <CardDescription>
                      {resource.author && <div>المؤلف: {resource.author}</div>}
                      <div>الفئة: {resource.category}</div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {resource.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        إضافة: {resource.createdAt.toLocaleDateString("ar-SA")}
                      </div>
                      <div className="flex space-x-2 space-x-reverse">
                        <Button variant="outline" size="sm">
                          تحميل
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(resource)}
                        >
                          تعديل
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteDialog(resource)}
                        >
                          حذف
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="audio" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getResourcesByType("صوت").map((resource) => (
                <Card
                  key={resource.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="text-2xl">🎵</span>
                        <CardTitle className="text-lg">
                          {resource.title}
                        </CardTitle>
                      </div>
                      <Badge className={getTypeColor(resource.type)}>
                        {resource.type}
                      </Badge>
                    </div>
                    <CardDescription>
                      {resource.author && <div>المؤلف: {resource.author}</div>}
                      <div>الفئة: {resource.category}</div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {resource.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        إضافة: {resource.createdAt.toLocaleDateString("ar-SA")}
                      </div>
                      <div className="flex space-x-2 space-x-reverse">
                        <Button variant="outline" size="sm">
                          استماع
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(resource)}
                        >
                          تعديل
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteDialog(resource)}
                        >
                          حذف
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="video" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getResourcesByType("فيديو").map((resource) => (
                <Card
                  key={resource.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="text-2xl">🎥</span>
                        <CardTitle className="text-lg">
                          {resource.title}
                        </CardTitle>
                      </div>
                      <Badge className={getTypeColor(resource.type)}>
                        {resource.type}
                      </Badge>
                    </div>
                    <CardDescription>
                      {resource.author && <div>المؤلف: {resource.author}</div>}
                      <div>الفئة: {resource.category}</div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {resource.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        إضافة: {resource.createdAt.toLocaleDateString("ar-SA")}
                      </div>
                      <div className="flex space-x-2 space-x-reverse">
                        <Button variant="outline" size="sm">
                          مشاهدة
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(resource)}
                        >
                          تعديل
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteDialog(resource)}
                        >
                          حذف
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="links" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getResourcesByType("رابط").map((resource) => (
                <Card
                  key={resource.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="text-2xl">🔗</span>
                        <CardTitle className="text-lg">
                          {resource.title}
                        </CardTitle>
                      </div>
                      <Badge className={getTypeColor(resource.type)}>
                        {resource.type}
                      </Badge>
                    </div>
                    <CardDescription>
                      {resource.author && <div>المؤلف: {resource.author}</div>}
                      <div>الفئة: {resource.category}</div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {resource.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        إضافة: {resource.createdAt.toLocaleDateString("ar-SA")}
                      </div>
                      <div className="flex space-x-2 space-x-reverse">
                        <Button variant="outline" size="sm">
                          زيارة
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(resource)}
                        >
                          تعديل
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteDialog(resource)}
                        >
                          حذف
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>جميع موارد المكتبة</CardTitle>
                <CardDescription>
                  عرض وإدارة جميع موارد المكتبة العلمية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>العنوان</TableHead>
                      <TableHead>المؤلف</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>الفئة</TableHead>
                      <TableHead>تاريخ الإضافة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResources.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <span>{getTypeIcon(resource.type)}</span>
                            <span>{resource.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>{resource.author}</TableCell>
                        <TableCell>
                          <Badge className={getTypeColor(resource.type)}>
                            {resource.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{resource.category}</TableCell>
                        <TableCell>
                          {resource.createdAt.toLocaleDateString("ar-SA")}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2 space-x-reverse">
                            <Button variant="outline" size="sm">
                              عرض
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(resource)}
                            >
                              تعديل
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => openDeleteDialog(resource)}
                            >
                              حذف
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تعديل المورد</DialogTitle>
            <DialogDescription>قم بتعديل بيانات المورد</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                العنوان
              </Label>
              <Input
                id="edit-title"
                value={newResource.title}
                onChange={(e) =>
                  setNewResource({ ...newResource, title: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-author" className="text-right">
                المؤلف
              </Label>
              <Input
                id="edit-author"
                value={newResource.author}
                onChange={(e) =>
                  setNewResource({ ...newResource, author: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">
                النوع
              </Label>
              <Select
                value={newResource.type}
                onValueChange={(value) =>
                  setNewResource({
                    ...newResource,
                    type: value as ResourceType,
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="صوت">صوت</SelectItem>
                  <SelectItem value="فيديو">فيديو</SelectItem>
                  <SelectItem value="رابط">رابط</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">
                الفئة
              </Label>
              <Select
                value={newResource.category}
                onValueChange={(value) =>
                  setNewResource({ ...newResource, category: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((c) => c !== "all")
                    .map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                الوصف
              </Label>
              <Textarea
                id="edit-description"
                value={newResource.description}
                onChange={(e) =>
                  setNewResource({
                    ...newResource,
                    description: e.target.value,
                  })
                }
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-url" className="text-right">
                الرابط
              </Label>
              <Input
                id="edit-url"
                value={newResource.url}
                onChange={(e) =>
                  setNewResource({ ...newResource, url: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button onClick={handleEditResource}>حفظ التعديلات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف المورد "{selectedResource?.title}"؟ لا يمكن
              التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDeleteResource}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Library;
