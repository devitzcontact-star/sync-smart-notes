import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Star, Save, Plus, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

interface NoteEditorProps {
  note: Note | undefined;
  onUpdateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  onRefetch: () => void;
}

export const NoteEditor = ({ note, onUpdateNote, onRefetch }: NoteEditorProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags || []);
      setIsFavorite(note.is_favorite);
      setSummary("");
    }
  }, [note]);

  const handleSave = async () => {
    if (!note) return;

    await onUpdateNote(note.id, {
      title,
      content,
      tags,
      is_favorite: isFavorite,
    });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setNewTag("");
      if (note) {
        onUpdateNote(note.id, { tags: updatedTags });
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    if (note) {
      onUpdateNote(note.id, { tags: updatedTags });
    }
  };

  const handleToggleFavorite = () => {
    const newFavorite = !isFavorite;
    setIsFavorite(newFavorite);
    if (note) {
      onUpdateNote(note.id, { is_favorite: newFavorite });
    }
  };

  const handleSummarize = async () => {
    if (!content.trim()) {
      toast({
        title: "No content",
        description: "Please add some content to summarize",
        variant: "destructive",
      });
      return;
    }

    setIsSummarizing(true);
    try {
      const { data, error } = await supabase.functions.invoke("summarize-note", {
        body: { content },
      });

      if (error) {
        throw error;
      }

      if (data?.summary) {
        setSummary(data.summary);
        toast({
          title: "Summary generated!",
          description: "Your note has been summarized by AI",
        });
      }
    } catch (error: any) {
      console.error("Summarization error:", error);
      toast({
        title: "Summarization failed",
        description: error.message || "Failed to generate summary",
        variant: "destructive",
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background to-accent/5">
        <div className="text-center space-y-4 p-8">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Select a note to start editing
          </h2>
          <p className="text-muted-foreground max-w-md">
            Choose a note from the sidebar or create a new one to begin your
            productive journey
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="border-b border-border p-4 bg-card/30 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <Input
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            className="text-2xl font-bold border-none focus-visible:ring-0 px-0 h-auto"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            className="shrink-0"
          >
            <Star
              className={`h-5 w-5 ${
                isFavorite ? "fill-accent text-accent" : "text-muted-foreground"
              }`}
            />
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            className="shrink-0 gap-2"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="gap-1 group hover:bg-destructive/10"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <div className="flex gap-2">
            <Input
              placeholder="Add tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
              className="h-7 w-32 text-sm"
            />
            <Button size="sm" variant="outline" onClick={handleAddTag} className="h-7 px-2">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto">
          <Textarea
            placeholder="Start writing your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={handleSave}
            className="min-h-[calc(100vh-20rem)] resize-none border-none focus-visible:ring-0 text-base leading-relaxed"
          />
        </div>

        <div className="w-full lg:w-96 border-t lg:border-l lg:border-t-0 border-border p-6 space-y-4 bg-card/20 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">AI Summary</h3>
            <Button
              onClick={handleSummarize}
              disabled={isSummarizing || !content.trim()}
              size="sm"
              className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              {isSummarizing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Summarizing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Summarize
                </>
              )}
            </Button>
          </div>

          {summary ? (
            <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <p className="text-sm leading-relaxed">{summary}</p>
            </Card>
          ) : (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Click "Summarize" to get an AI-powered summary of your note
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
