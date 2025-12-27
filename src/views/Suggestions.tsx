'use client';

import PageHeader from "@/components/PageHeader";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Suggestion {
  id: string;
  title: string;
  description: string;
  status: "تم" | "لم يتم";
  suggested_by?: string;
  priority?: "عالي" | "متوسط" | "منخفض";
  created_at: string;
}

const Suggestions = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [suggestedBy, setSuggestedBy] = useState("");
  const [priority, setPriority] = useState<"عالي" | "متوسط" | "منخفض">("متوسط");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadSuggestions = async () => {
    const { data, error } = await supabase
      .from("suggestions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "خطأ في تحميل المقترحات", variant: "destructive" });
    } else {
      setSuggestions((data as Suggestion[]) || []);
    }
  };

  useEffect(() => {
    loadSuggestions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsLoading(true);
    const { error } = await supabase.from("suggestions").insert([
      {
        title,
        description,
        suggested_by: suggestedBy || null,
        priority,
        status: "لم يتم",
      },
    ]);

    if (error) {
      toast({ title: "خطأ في إضافة المقترح", variant: "destructive" });
    } else {
      toast({ title: "تم إضافة المقترح بنجاح" });
      setTitle("");
      setDescription("");
      setSuggestedBy("");
      setPriority("متوسط");
      loadSuggestions();
    }
    setIsLoading(false);
  };

  const updateStatus = async (id: string, newStatus: "تم" | "لم يتم") => {
    const { error } = await supabase
      .from("suggestions")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast({ title: "خطأ في تحديث الحالة", variant: "destructive" });
    } else {
      toast({ title: "تم تحديث الحالة بنجاح" });
      loadSuggestions();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="المقترحات والمشكلات" />
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">إضافة مقترح جديد</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">عنوان المقترح</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="أدخل عنوان المقترح"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">التفاصيل</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="اشرح المقترح أو المشكلة بالتفصيل"
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">مقدم المقترح (اختياري)</label>
                  <Input
                    value={suggestedBy}
                    onChange={(e) => setSuggestedBy(e.target.value)}
                    placeholder="اسم مقدم المقترح"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الأولوية</label>
                  <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="عالي">عالي</SelectItem>
                      <SelectItem value="متوسط">متوسط</SelectItem>
                      <SelectItem value="منخفض">منخفض</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "جاري الإضافة..." : "إضافة المقترح"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* List Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-primary mb-4">المقترحات المسجلة</h3>
            {suggestions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  لا توجد مقترحات بعد. ابدأ بإضافة أول مقترح!
                </CardContent>
              </Card>
            ) : (
              suggestions.map((suggestion) => (
                <Card key={suggestion.id} className="border-r-4 border-r-primary">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-lg">{suggestion.title}</h4>
                      <Badge variant={suggestion.priority === "عالي" ? "destructive" : "secondary"}>
                        {suggestion.priority}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{suggestion.description}</p>
                    {suggestion.suggested_by && (
                      <p className="text-sm text-muted-foreground mb-2">
                        مقدم من: {suggestion.suggested_by}
                      </p>
                    )}
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant={suggestion.status === "تم" ? "default" : "outline"}
                        onClick={() => updateStatus(suggestion.id, "تم")}
                      >
                        تم
                      </Button>
                      <Button
                        size="sm"
                        variant={suggestion.status === "لم يتم" ? "default" : "outline"}
                        onClick={() => updateStatus(suggestion.id, "لم يتم")}
                      >
                        لم يتم
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Suggestions;
