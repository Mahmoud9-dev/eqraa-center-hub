import PageHeader from "@/components/PageHeader";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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

interface Meeting {
  id: string;
  title: string;
  description: string;
  meeting_date: string;
  status: "مجدولة" | "مكتملة" | "ملغاة";
  notes?: string;
}

const Meetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const { toast } = useToast();

  const loadMeetings = async () => {
    const { data, error } = await supabase
      .from("meetings")
      .select("*")
      .order("meeting_date", { ascending: false });

    if (!error) {
      setMeetings((data as Meeting[]) || []);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !meetingDate) return;

    setIsLoading(true);
    const { error } = await supabase.from("meetings").insert([
      {
        title,
        description,
        meeting_date: new Date(meetingDate).toISOString(),
        status: "مجدولة",
      },
    ]);

    if (error) {
      toast({ title: "خطأ في إضافة الاجتماع", variant: "destructive" });
    } else {
      toast({ title: "تم إضافة الاجتماع بنجاح" });
      setTitle("");
      setDescription("");
      setMeetingDate("");
      loadMeetings();
    }
    setIsLoading(false);
  };

  const updateStatus = async (
    id: string,
    newStatus: "مجدولة" | "مكتملة" | "ملغاة"
  ) => {
    const { error } = await supabase
      .from("meetings")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      toast({ title: "تم تحديث الحالة" });
      loadMeetings();
    }
  };

  const deleteMeeting = async () => {
    if (!selectedMeeting) return;

    const { error } = await supabase
      .from("meetings")
      .delete()
      .eq("id", selectedMeeting.id);

    if (error) {
      toast({ title: "خطأ في حذف الاجتماع", variant: "destructive" });
    } else {
      toast({ title: "تم حذف الاجتماع بنجاح" });
      loadMeetings();
    }
    setIsDeleteDialogOpen(false);
    setSelectedMeeting(null);
  };

  const openDeleteDialog = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="الاجتماعات" />
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">
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
                    required
                  />
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
                    required
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "جاري الإضافة..." : "جدولة الاجتماع"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="bg-card p-6 rounded-xl shadow-[var(--shadow-soft)] border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">🤝</div>
              <h3 className="text-xl font-semibold text-primary">
                أنواع الاجتماعات
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                <div className="text-2xl">👨‍🏫</div>
                <div>
                  <h4 className="font-semibold">اجتماعات المعلمين</h4>
                  <p className="text-sm text-muted-foreground">
                    تنسيق وتخطيط الحلقات
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                <div className="text-2xl">👥</div>
                <div>
                  <h4 className="font-semibold">اجتماعات أولياء الأمور</h4>
                  <p className="text-sm text-muted-foreground">
                    متابعة تقدم الأبناء
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                <div className="text-2xl">⚙️</div>
                <div>
                  <h4 className="font-semibold">اجتماعات إدارية</h4>
                  <p className="text-sm text-muted-foreground">
                    قرارات وتطوير المركز
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-primary mb-6">
            الاجتماعات المجدولة
          </h3>
          {meetings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                لا توجد اجتماعات مجدولة
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <Card key={meeting.id} className="border-r-4 border-r-primary">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-lg">{meeting.title}</h4>
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
                    <p className="text-muted-foreground mb-2">
                      {meeting.description}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {new Date(meeting.meeting_date).toLocaleString("ar")}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(meeting.id, "مجدولة")}
                      >
                        مجدولة
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(meeting.id, "مكتملة")}
                      >
                        مكتملة
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(meeting.id, "ملغاة")}
                      >
                        ملغاة
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openDeleteDialog(meeting)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف الاجتماع "{selectedMeeting?.title}"؟ لا يمكن
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
            <Button variant="destructive" onClick={deleteMeeting}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Meetings;
