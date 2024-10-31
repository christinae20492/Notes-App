import { useState, useEffect } from "react";
import { copyNote, deleteNote } from "~/utils/noteutility";
import { successToast } from "~/utils/toast";

interface NoteModalProps {
  isOpen: boolean;
  note: any;
  onClose: () => void;
  onSaveNote: (updatedContent: string) => void;
  setNotes: React.Dispatch<React.SetStateAction<any[]>>;
  navigate: (path: string) => void;
  isInFolder: boolean;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  note,
  onClose,
  onSaveNote,
  setNotes,
  navigate,
  isInFolder,
}) => {
  
  const [updatedNote, setUpdatedNote] = useState(note);

  useEffect(() => {
    if (note) {
      setUpdatedNote(note.body);
    }
  }, [note]);

  const handleDeleteNote = () => {
    if (note?.id) {
      deleteNote(note.id, setNotes, navigate, isInFolder);
      onClose();
    }
  };

  const handleCopyNote = () => {
    copyNote(note.id, setNotes, isInFolder);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-main bg-lightgrey h-1/2 w-1/2">
        <h2 className="text-xl font-semibold mb-4 text-center">{note.title}</h2>
        <textarea
          value={updatedNote}
          onChange={(e) => setUpdatedNote(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded h-3/4"
        />
        <div className="flex justify-end mt-4">
          <button className="button bg-blue" onClick={handleCopyNote}>
            Copy
          </button>
          <button className="button bg-red" onClick={handleDeleteNote}>
            Delete
          </button>
          <button className="button" onClick={onClose}>
            Close
          </button>
          <button
            className="submit-button"
            onClick={() => onSaveNote(updatedNote)}
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
};
