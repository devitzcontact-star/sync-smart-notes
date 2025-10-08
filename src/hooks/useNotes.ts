import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  is_favorite: boolean;
  is_public: boolean;
  slug: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;

      setNotes(data || []);
    } catch (error: any) {
      console.error("Error fetching notes:", error);
      toast({
        title: "Error loading notes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();

    const channel = supabase
      .channel("notes-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notes",
        },
        () => {
          fetchNotes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createNote = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("notes")
        .insert({
          user_id: user.id,
          title: "Untitled Note",
          content: "",
          tags: [],
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Note created",
        description: "Your new note is ready",
      });

      return data;
    } catch (error: any) {
      console.error("Error creating note:", error);
      toast({
        title: "Error creating note",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    try {
      const { error } = await supabase
        .from("notes")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    } catch (error: any) {
      console.error("Error updating note:", error);
      toast({
        title: "Error updating note",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase.from("notes").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Note deleted",
        description: "Your note has been removed",
      });
    } catch (error: any) {
      console.error("Error deleting note:", error);
      toast({
        title: "Error deleting note",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    notes,
    isLoading,
    createNote,
    updateNote,
    deleteNote,
    refetch: fetchNotes,
  };
};
