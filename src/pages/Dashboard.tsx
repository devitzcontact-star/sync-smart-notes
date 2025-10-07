import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { NotesList } from "@/components/dashboard/NotesList";
import { NoteEditor } from "@/components/dashboard/NoteEditor";
import { FloatingActionButton } from "@/components/dashboard/FloatingActionButton";
import { useNotes } from "@/hooks/useNotes";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { notes, isLoading: notesLoading, createNote, updateNote, deleteNote, refetch } = useNotes();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleCreateNote = async () => {
    const newNote = await createNote();
    if (newNote) {
      setSelectedNoteId(newNote.id);
    }
  };

  const handleDeleteNote = async (id: string) => {
    await deleteNote(id);
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }
  };

  const selectedNote = notes.find(note => note.id === selectedNoteId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <DashboardHeader user={user} onSignOut={handleSignOut} />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <NotesList
          notes={notes}
          selectedNoteId={selectedNoteId}
          onSelectNote={setSelectedNoteId}
          onDeleteNote={handleDeleteNote}
          isLoading={notesLoading}
        />
        
        <NoteEditor
          note={selectedNote}
          onUpdateNote={updateNote}
          onRefetch={refetch}
        />
      </div>

      <FloatingActionButton onClick={handleCreateNote} />
    </div>
  );
};

export default Dashboard;
