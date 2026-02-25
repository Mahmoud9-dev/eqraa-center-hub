'use client';

import PageHeader from "@/components/PageHeader";
import { useState, useEffect } from "react";
import { getSupabase } from "@/integrations/supabase/client";
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
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDateTime } from "@/lib/i18n";

interface Meeting {
  id: string;
  title: string;
  description: string;
  meeting_date: string;
  status: "مجدولة" | "مكتملة" | "ملغاة";
  notes?: string;
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
  const { t, tFunc, languageMeta } = useLanguage();

  // Label maps: DB Arabic values -> translated display labels
  const statusLabelMap: Record<string, string> = {
    "مجدولة": t.meetings.statusLabels.scheduled,
    "مكتملة": t.meetings.statusLabels.completed,
    "ملغاة": t.meetings.statusLabels.cancelled,
  };

  const typeLabelMap: Record<string, string> = {
    "المعلمين": t.meetings.typeLabels.teachers,
    "أولياء الأمور": t.meetings.typeLabels.parents,
    "إدارية": t.meetings.typeLabels.admin,
  };

  const loadMeetings = async () => {
    const { data, error } = await getSupabase()
      .from("meetings")
      .select("*")
      .order("meeting_date", { ascending: false });

    if (!error) {
      setMeetings((data as Meeting[]) || []);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMeetings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !meetingDate) return;

    setIsLoading(true);
    const { error } = await getSupabase().from("meetings").insert([
      {
        title,
        description,
        meeting_date: new Date(meetingDate).toISOString(),
        status: "مجدولة",
        type: meetingType,
      },
    ]);

    if (error) {
      toast({ title: t.meetings.toast.addError, variant: "destructive" });
    } else {
      toast({ title: t.meetings.toast.addSuccess });
      setTitle("");
      setDescription("");
      setMeetingDate("");
      setMeetingType("المعلمين");
      loadMeetings();
    }
    setIsLoading(false);
  };

  const updateStatus = async (
    id: string,
    newStatus: "مجدولة" | "مكتملة" | "ملغاة"
  ) => {
    const { error } = await getSupabase()
      .from("meetings")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      toast({ title: t.meetings.toast.statusUpdated });
      loadMeetings();
    }
  };

  const deleteMeeting = async () => {
    if (!selectedMeeting) return;

    const { error } = await getSupabase()
      .from("meetings")
      .delete()
      .eq("id", selectedMeeting.id);

    if (error) {
      toast({ title: t.meetings.toast.deleteError, variant: "destructive" });
    } else {
      toast({ title: t.meetings.toast.deleteSuccess });
      loadMeetings();
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
      <PageHeader title={t.meetings.pageTitle} />
      <main className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl text-primary">
                {t.meetings.form.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t.meetings.form.meetingTitle}
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t.meetings.form.meetingTitlePlaceholder}
                    className="text-base sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t.meetings.form.meetingType}
                  </label>
                  <Select
                    value={meetingType}
                    onValueChange={(
                      value: "المعلمين" | "أولياء الأمور" | "إدارية"
                    ) => setMeetingType(value)}
                  >
                    <SelectTrigger className="text-base sm:text-sm">
                      <SelectValue placeholder={t.meetings.form.meetingTypePlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="المعلمين">
                        {t.meetings.form.typeOptions.teachers}
                      </SelectItem>
                      <SelectItem value="أولياء الأمور">
                        {t.meetings.form.typeOptions.parents}
                      </SelectItem>
                      <SelectItem value="إدارية">
                        {t.meetings.form.typeOptions.admin}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t.meetings.form.details}
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t.meetings.form.detailsPlaceholder}
                    rows={3}
                    className="text-base sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t.meetings.form.dateTime}
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
                  {isLoading ? t.meetings.form.submitting : t.meetings.form.submit}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="bg-card p-4 sm:p-6 rounded-xl shadow-[var(--shadow-soft)] border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl sm:text-4xl">🤝</div>
              <h3 className="text-lg sm:text-xl font-semibold text-primary">
                {t.meetings.sections.meetingTypes}
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
                    {t.meetings.typeCards.teachers.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {t.meetings.typeCards.teachers.description}
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
                    {t.meetings.typeCards.parents.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {t.meetings.typeCards.parents.description}
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
                    {t.meetings.typeCards.admin.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {t.meetings.typeCards.admin.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-primary">
              {t.meetings.sections.scheduledMeetings}
            </h3>
            {filterType !== "all" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterType("all")}
                className="text-xs sm:text-sm"
              >
                {t.meetings.sections.viewAll}
              </Button>
            )}
          </div>
          {filteredMeetings.length === 0 ? (
            <Card>
              <CardContent className="p-6 sm:p-8 text-center text-muted-foreground">
                {filterType === "all"
                  ? t.meetings.empty.all
                  : tFunc('meetings.empty.filtered', { type: typeLabelMap[filterType] || filterType })}
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
                            {typeLabelMap[meeting.type] || meeting.type}
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
                        {statusLabelMap[meeting.status] || meeting.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-2 text-sm sm:text-base">
                      {meeting.description}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                      {formatDateTime(meeting.meeting_date, languageMeta.code)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(meeting.id, "مجدولة")}
                        className="text-xs sm:text-sm"
                      >
                        {t.meetings.statusLabels.scheduled}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(meeting.id, "مكتملة")}
                        className="text-xs sm:text-sm"
                      >
                        {t.meetings.statusLabels.completed}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(meeting.id, "ملغاة")}
                        className="text-xs sm:text-sm"
                      >
                        {t.meetings.statusLabels.cancelled}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openDeleteDialog(meeting)}
                        className="text-xs sm:text-sm"
                      >
                        {t.meetings.actions.delete}
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
              {t.meetings.deleteDialog.title}
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-xs">
              {tFunc('meetings.deleteDialog.message', { title: selectedMeeting?.title || '' })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="text-sm"
            >
              {t.meetings.deleteDialog.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={deleteMeeting}
              className="text-sm"
            >
              {t.meetings.deleteDialog.confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Meetings;
