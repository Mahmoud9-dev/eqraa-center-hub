'use client';

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
      resource.description?.toLowerCase().includes(searchTerm.toLowerCase());
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

          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Input
                placeholder="البحث في المكتبة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full sm:w-48">
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
          <div className="overflow-x-auto -mx-4 px-4 pb-2">
            <TabsList className="inline-flex w-auto min-w-full sm:grid sm:w-full sm:grid-cols-5 gap-1">
              <TabsTrigger value="books" className="text-xs sm:text-sm whitespace-nowrap">الكتب PDF</TabsTrigger>
              <TabsTrigger value="audio" className="text-xs sm:text-sm whitespace-nowrap">المقاطع الصوتية</TabsTrigger>
              <TabsTrigger value="video" className="text-xs sm:text-sm whitespace-nowrap">الفيديوهات</TabsTrigger>
              <TabsTrigger value="links" className="text-xs sm:text-sm whitespace-nowrap">الروابط الموثوقة</TabsTrigger>
              <TabsTrigger value="all" className="text-xs sm:text-sm whitespace-nowrap">جميع الموارد</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="books" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getResourcesByType("PDF").map((resource) => (
                <Card
                  key={resource.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-2xl shrink-0">📄</span>
                        <CardTitle className="text-base truncate">
                          {resource.title}
                        </CardTitle>
                      </div>
                      <Badge className={`${getTypeColor(resource.type)} shrink-0 text-xs`}>
                        {resource.type}
                      </Badge>
                    </div>
                    <CardDescription>
                      {resource.author && <div>المؤلف: {resource.author}</div>}
                      <div>الفئة: {resource.category}</div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {resource.description}
                    </p>
                    <div className="text-xs text-muted-foreground mb-3">
                      إضافة: {resource.createdAt.toLocaleDateString("ar-SA")}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="flex-1 min-w-[70px] text-xs">
                        تحميل
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 min-w-[70px] text-xs"
                        onClick={() => openEditDialog(resource)}
                      >
                        تعديل
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1 min-w-[70px] text-xs"
                        onClick={() => openDeleteDialog(resource)}
                      >
                        حذف
                      </Button>
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
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-2xl shrink-0">🎵</span>
                        <CardTitle className="text-base truncate">
                          {resource.title}
                        </CardTitle>
                      </div>
                      <Badge className={`${getTypeColor(resource.type)} shrink-0 text-xs`}>
                        {resource.type}
                      </Badge>
                    </div>
                    <CardDescription>
                      {resource.author && <div>المؤلف: {resource.author}</div>}
                      <div>الفئة: {resource.category}</div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {resource.description}
                    </p>
                    <div className="text-xs text-muted-foreground mb-3">
                      إضافة: {resource.createdAt.toLocaleDateString("ar-SA")}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="flex-1 min-w-[70px] text-xs">
                        استماع
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 min-w-[70px] text-xs"
                        onClick={() => openEditDialog(resource)}
                      >
                        تعديل
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1 min-w-[70px] text-xs"
                        onClick={() => openDeleteDialog(resource)}
                      >
                        حذف
                      </Button>
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
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-2xl shrink-0">🎥</span>
                        <CardTitle className="text-base truncate">
                          {resource.title}
                        </CardTitle>
                      </div>
                      <Badge className={`${getTypeColor(resource.type)} shrink-0 text-xs`}>
                        {resource.type}
                      </Badge>
                    </div>
                    <CardDescription>
                      {resource.author && <div>المؤلف: {resource.author}</div>}
                      <div>الفئة: {resource.category}</div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {resource.description}
                    </p>
                    <div className="text-xs text-muted-foreground mb-3">
                      إضافة: {resource.createdAt.toLocaleDateString("ar-SA")}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="flex-1 min-w-[70px] text-xs">
                        مشاهدة
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 min-w-[70px] text-xs"
                        onClick={() => openEditDialog(resource)}
                      >
                        تعديل
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1 min-w-[70px] text-xs"
                        onClick={() => openDeleteDialog(resource)}
                      >
                        حذف
                      </Button>
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
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-2xl shrink-0">🔗</span>
                        <CardTitle className="text-base truncate">
                          {resource.title}
                        </CardTitle>
                      </div>
                      <Badge className={`${getTypeColor(resource.type)} shrink-0 text-xs`}>
                        {resource.type}
                      </Badge>
                    </div>
                    <CardDescription>
                      {resource.author && <div>المؤلف: {resource.author}</div>}
                      <div>الفئة: {resource.category}</div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {resource.description}
                    </p>
                    <div className="text-xs text-muted-foreground mb-3">
                      إضافة: {resource.createdAt.toLocaleDateString("ar-SA")}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="flex-1 min-w-[70px] text-xs">
                        زيارة
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 min-w-[70px] text-xs"
                        onClick={() => openEditDialog(resource)}
                      >
                        تعديل
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1 min-w-[70px] text-xs"
                        onClick={() => openDeleteDialog(resource)}
                      >
                        حذف
                      </Button>
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
                {/* Mobile Card View */}
                <div className="block md:hidden space-y-4">
                  {filteredResources.map((resource) => (
                    <div key={resource.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xl shrink-0">{getTypeIcon(resource.type)}</span>
                          <h4 className="font-medium text-sm truncate">{resource.title}</h4>
                        </div>
                        <Badge className={`${getTypeColor(resource.type)} text-xs shrink-0`}>
                          {resource.type}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        {resource.author && <div>المؤلف: {resource.author}</div>}
                        <div>الفئة: {resource.category}</div>
                        <div>إضافة: {resource.createdAt.toLocaleDateString("ar-SA")}</div>
                      </div>
                      <div className="flex gap-2 pt-2 border-t">
                        <Button variant="outline" size="sm" className="flex-1 text-xs">
                          عرض
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => openEditDialog(resource)}
                        >
                          تعديل
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => openDeleteDialog(resource)}
                        >
                          حذف
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>العنوان</TableHead>
                        <TableHead className="hidden lg:table-cell">المؤلف</TableHead>
                        <TableHead>النوع</TableHead>
                        <TableHead className="hidden lg:table-cell">الفئة</TableHead>
                        <TableHead className="hidden lg:table-cell">تاريخ الإضافة</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResources.map((resource) => (
                        <TableRow key={resource.id}>
                          <TableCell className="font-medium max-w-[200px]">
                            <div className="flex items-center gap-2">
                              <span className="shrink-0">{getTypeIcon(resource.type)}</span>
                              <span className="truncate">{resource.title}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">{resource.author}</TableCell>
                          <TableCell>
                            <Badge className={getTypeColor(resource.type)}>
                              {resource.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">{resource.category}</TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {resource.createdAt.toLocaleDateString("ar-SA")}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm" className="text-xs px-2">
                                عرض
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs px-2"
                                onClick={() => openEditDialog(resource)}
                              >
                                تعديل
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="text-xs px-2"
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
                </div>
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
