'use client';

import PageHeader from "@/components/PageHeader";
import { useState, useEffect } from "react";
import * as tajweedLessonsService from "@/lib/db/services/tajweedLessons";
import type { DbTajweedLesson } from "@/lib/db/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Tajweed = () => {
  const [lessons, setLessons] = useState<DbTajweedLesson[]>([]);
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadLessons = async () => {
    try {
      const data = await tajweedLessonsService.getAll();
      setLessons(data || []);
    } catch (error) {
      console.error("Error loading tajweed lessons:", error);
      toast({ title: "خطأ", description: "فشل تحميل دروس التجويد", variant: "destructive" });
    }
  };

  useEffect(() => {
    loadLessons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !description) return;

    setIsLoading(true);
    try {
      await tajweedLessonsService.add({
        topic,
        description,
        teacherId: null,
        lessonDate: null,
        attendees: null,
        resources: null,
      });
      toast({ title: "تم إضافة الدرس بنجاح" });
      setTopic("");
      setDescription("");
      loadLessons();
    } catch (error) {
      console.error("Error adding tajweed lesson:", error);
      toast({ title: "خطأ في إضافة الدرس", variant: "destructive" });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="التجويد" />
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">إضافة درس تجويد</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">موضوع الدرس</label>
                  <Input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="مثال: أحكام النون الساكنة"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">شرح الدرس</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="اشرح محتوى الدرس والنقاط المهمة"
                    rows={4}
                    required
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "جاري الإضافة..." : "إضافة الدرس"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="bg-card p-8 rounded-xl shadow-[var(--shadow-soft)] border border-border">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-2xl font-semibold mb-4 text-primary">أحكام التجويد</h3>
            <p className="text-muted-foreground mb-6">دراسة وتطبيق أحكام التجويد والتلاوة الصحيحة</p>
            <div className="space-y-3">
              <div className="p-4 bg-accent/30 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">أحكام النون الساكنة والتنوين</h4>
                <p className="text-sm text-muted-foreground">الإظهار، الإدغام، الإقلاب، الإخفاء</p>
              </div>
              <div className="p-4 bg-accent/30 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">أحكام المدود</h4>
                <p className="text-sm text-muted-foreground">المد الطبيعي والفرعي وأنواعه</p>
              </div>
              <div className="p-4 bg-accent/30 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">صفات الحروف</h4>
                <p className="text-sm text-muted-foreground">الصفات اللازمة والعارضة</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-primary mb-6">الدروس المسجلة</h3>
          {lessons.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                لا توجد دروس مسجلة بعد
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lessons.map((lesson) => (
                <Card key={lesson.id} className="border-r-4 border-r-primary">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg mb-2">{lesson.topic}</h4>
                    <p className="text-muted-foreground mb-2">{lesson.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {lesson.lessonDate ? new Date(lesson.lessonDate).toLocaleDateString("ar") : "بدون تاريخ"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Tajweed;
