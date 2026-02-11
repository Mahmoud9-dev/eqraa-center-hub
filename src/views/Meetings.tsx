'use client';

import PageHeader from "@/components/PageHeader";
import { useState, useEffect } from "react";
import * as meetingsService from "@/lib/db/services/meetings";
import type { DbMeeting } from "@/lib/db/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/dialog";

interface Meeting extends DbMeeting {
  type?: "المعلمين" | "أولياء الأمور" | "إدارية";
}

const Meetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingType, setMeetingType] = useState<
    "المعلمين" | "أولياء الأمور" | "إدارية"
  >("المعلمين");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const { toast } = useToast();

  const loadMeetings = async () => {
    try {
      const data = await meetingsService.getAll();
      setMeetings((data as Meeting[]) || []);
    } catch (error) {
      console.error("Error loading meetings:", error);
      toast({ title: "خطأ", description: "فشل تحميل الاجتماعات", variant: "destructive" });
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !meetingDate) return;

    setIsLoading(true);
    try {
      await meetingsService.add({
        title,
        description,
        meetingDate: new Date(meetingDate).toISOString(),
        status: "مجدولة",
        attendees: null,
        agenda: null,
        notes: meetingType, // Store type in notes field for backward compatibility
      });
      toast({ title: "تم إضافة الاجتماع بنجاح" });
      setTitle("");
      setDescription("");
      setMeetingDate("");
      setMeetingType("المعلمين");
      loadMeetings();
    } catch (error) {
      console.error("Error adding meeting:", error);
      toast({ title: "خطأ في إضافة الاجتماع", variant: "destructive" });
    }
    setIsLoading(false);
  };

  const updateStatus = async (
    id: string,
    newStatus: "مجدولة" | "مكتملة" | "ملغاة"
  ) => {
    try {
      await meetingsService.updateStatus(id, newStatus);
      toast({ title: "تم تحديث الحالة" });
      loadMeetings();
    } catch (error) {
      console.error("Error updating meeting status:", error);
      toast({ title: "خطأ", description: "فشل تحديث حالة الاجتماع", variant: "destructive" });
    }
  };

  const deleteMeeting = async () => {
    if (!selectedMeeting) return;

    try {
      await meetingsService.remove(selectedMeeting.id);
      toast({ title: "تم حذف الاجتماع بنجاح" });
      loadMeetings();
    } catch (error) {
      console.error("Error deleting meeting:", error);
      toast({ title: "خطأ في حذف الاجتماع", variant: "destructive" });
    }
    setIsDeleteDialogOpen(false);
    setSelectedMeeting(null);
  };

  const openDeleteDialog = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsDeleteDialogOpen(true);
  };

  // Filter meetings based on selected type
  const filteredMeetings =
    filterType === "all"
      ? meetings
      : meetings.filter((meeting) => meeting.type === filterType);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="الاجتماعات" />
      <main className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl text-primary">
                جدولة اجتماع جديد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    عنوان الاجتماع
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: اجتماع المعلمين الأسبوعي"
                    className="text-base sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    نوع الاجتماع
                  </label>
                  <Select
                    value={meetingType}
                    onValueChange={(
                      value: "المعلمين" | "أولياء الأمور" | "إدارية"
                    ) => setMeetingType(value)}
                  >
                    <SelectTrigger className="text-base sm:text-sm">
                      <SelectValue placeholder="اختر نوع الاجتماع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="المعلمين">
                        اجتماعات المعلمين
                      </SelectItem>
                      <SelectItem value="أولياء الأمور">
                        اجتماعات أولياء الأمور
                      </SelectItem>
                      <SelectItem value="إدارية">اجتماعات إدارية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    التفاصيل
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="اشرح جدول الأعمال والموضوعات"
                    rows={3}
                    className="text-base sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    تاريخ ووقت الاجتماع
                  </label>
                  <Input
                    type="datetime-local"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="text-base sm:text-sm"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full text-base sm:text-sm py-3 sm:py-2"
                >
                  {isLoading ? "جاري الإضافة..." : "جدولة الاجتماع"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="bg-card p-4 sm:p-6 rounded-xl shadow-[var(--shadow-soft)] border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl sm:text-4xl">🤝</div>
              <h3 className="text-lg sm:text-xl font-semibold text-primary">
                أنواع الاجتماعات
              </h3>
            </div>
            <div className="space-y-3">
              <div
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  filterType === "المعلمين" || filterType === "all"
                    ? "bg-primary/20 border border-primary/30"
                    : "bg-primary/5 hover:bg-primary/10"
                }`}
                onClick={() =>
                  setFilterType(filterType === "المعلمين" ? "all" : "المعلمين")
                }
              >
                <div className="text-xl sm:text-2xl">👨‍🏫</div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base">
                    اجتماعات المعلمين
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    تنسيق وتخطيط الحلقات
                  </p>
                </div>
              </div>
              <div
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  filterType === "أولياء الأمور" || filterType === "all"
                    ? "bg-primary/20 border border-primary/30"
                    : "bg-primary/5 hover:bg-primary/10"
                }`}
                onClick={() =>
                  setFilterType(
                    filterType === "أولياء الأمور" ? "all" : "أولياء الأمور"
                  )
                }
              >
                <div className="text-xl sm:text-2xl">👥</div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base">
                    اجتماعات أولياء الأمور
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    متابعة تقدم الأبناء
                  </p>
                </div>
              </div>
              <div
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  filterType === "إدارية" || filterType === "all"
                    ? "bg-primary/20 border border-primary/30"
                    : "bg-primary/5 hover:bg-primary/10"
                }`}
                onClick={() =>
                  setFilterType(filterType === "إدارية" ? "all" : "إدارية")
                }
              >
                <div className="text-xl sm:text-2xl">⚙️</div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base">
                    اجتماعات إدارية
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    قرارات وتطوير المركز
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-primary">
              الاجتماعات المجدولة
            </h3>
            {filterType !== "all" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterType("all")}
                className="text-xs sm:text-sm"
              >
                عرض جميع الاجتماعات
              </Button>
            )}
          </div>
          {filteredMeetings.length === 0 ? (
            <Card>
              <CardContent className="p-6 sm:p-8 text-center text-muted-foreground">
                {filterType === "all"
                  ? "لا توجد اجتماعات مجدولة"
                  : `لا توجد اجتماعات من نوع "${filterType}" مجدولة`}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredMeetings.map((meeting) => (
                <Card key={meeting.id} className="border-r-4 border-r-primary">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                      <div>
                        <h4 className="font-bold text-base sm:text-lg mb-2 sm:mb-0">
                          {meeting.title}
                        </h4>
                        {meeting.type && (
                          <Badge
                            variant="outline"
                            className="text-xs mb-2 sm:mb-0"
                          >
                            {meeting.type}
                          </Badge>
                        )}
                      </div>
                      <Badge
                        variant={
                          meeting.status === "مكتملة"
                            ? "default"
                            : meeting.status === "ملغاة"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {meeting.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-2 text-sm sm:text-base">
                      {meeting.description}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                      {new Date(meeting.meetingDate).toLocaleString("ar")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(meeting.id, "مجدولة")}
                        className="text-xs sm:text-sm"
                      >
                        مجدولة
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(meeting.id, "مكتملة")}
                        className="text-xs sm:text-sm"
                      >
                        مكتملة
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(meeting.id, "ملغاة")}
                        className="text-xs sm:text-sm"
                      >
                        ملغاة
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openDeleteDialog(meeting)}
                        className="text-xs sm:text-sm"
                      >
                        حذف
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-base">
              تأكيد الحذف
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-xs">
              هل أنت متأكد من حذف الاجتماع "{selectedMeeting?.title}"؟ لا يمكن
              التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="text-sm"
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={deleteMeeting}
              className="text-sm"
            >
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Meetings;
