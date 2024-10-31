import { successToast, failToast} from './toast';
import { idGen, getCurrentDateTime } from './rangen';

    const NOTES_KEY='notes';
    const TRASH_KEY='trash notes';
    
//Getters

export const loadNotes = (): any[] => {
  try {
    const jsonValue = localStorage.getItem(NOTES_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error(`Failed to load notes: ${error}`);
    return [];
  }
};

export const loadTrash = (): any[] => {
  try {
    const jsonValue = localStorage.getItem(TRASH_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error(`Failed to load trash: ${error}`);
    return [];
  }
};

//Note functions

export const saveNote = (
  title: string,
  body: string,
  color: string,
  category: string,
  setNotes: React.Dispatch<React.SetStateAction<any[]>>,
  setNewNote: React.Dispatch<React.SetStateAction<string>>,
  navigate: (path: string) => void
): void => {
  try {
    const existingNotes = loadNotes();

    if (!title.trim() && !body.trim()) {
      failToast("Cannot save an empty note without a title or body.");
      return;
    }

    if (!title.trim()) {
      let untitledNumber = 1;
      let newTitle = `Untitled note ${untitledNumber}`;

      while (existingNotes.some(note => note.title === newTitle)) {
        untitledNumber += 1;
        newTitle = `Untitled note ${untitledNumber}`;
      }

      title = newTitle;
    }

    const newNote = {
      id: idGen(),
      title,
      body,
      color,
      category,
      tag:'none',
      dateCreated: getCurrentDateTime(),
    };

    const newNotes = [...existingNotes, newNote];
    setNotes(newNotes);
    localStorage.setItem(NOTES_KEY, JSON.stringify(newNotes));
    setNewNote('');
    successToast('Note saved successfully!');
    navigate('/');
  } catch (error) {
    failToast(`Failed to save note: ${error}`);
  }
};

export const deleteNote = (
  id: string,
  setNotes: React.Dispatch<React.SetStateAction<any[]>>,
  navigate: (path: string) => void
): void => {
  try {
    const existingNotes = loadNotes(); 
    const noteToDelete = existingNotes.find(note => note.id === id); 
    const remainingNotes = existingNotes.filter(note => note.id !== id);
    
    if (!noteToDelete) {
      failToast("Note not found.");
      return;
    }

    const trashNotes = loadTrash();
    const updatedTrashNotes = [...trashNotes, noteToDelete];
    localStorage.setItem(NOTES_KEY, JSON.stringify(remainingNotes));
    localStorage.setItem(TRASH_KEY, JSON.stringify(updatedTrashNotes));
    
    setNotes(remainingNotes);
    
    successToast('Note moved to Trash successfully!');
    navigate('/');
  } catch (error) {
    failToast(`Failed to move note to Trash: ${error}`);
  }
};

export const permanentlyDeleteNote = (
  id: string,
  setTrashNotes: React.Dispatch<React.SetStateAction<any[]>>,
  navigate: (path: string) => void
): void => {
  try {
    const trashNotes = loadTrash();
    const updatedTrashNotes = trashNotes.filter(note => note.id !== id);
    localStorage.setItem(TRASH_KEY, JSON.stringify(updatedTrashNotes));
    setTrashNotes(updatedTrashNotes);
    
    successToast('Note permanently deleted.');
    navigate('/trash');
  } catch (error) {
    failToast(`Failed to permanently delete note: ${error}`);
  }
};

export const restoreNote = (
  id: string,
  setTrashNotes: React.Dispatch<React.SetStateAction<any[]>>,
  setNotes: React.Dispatch<React.SetStateAction<any[]>>,
  navigate: (path: string) => void
): void => {
  try {
    const trashNotes = loadTrash();
    const noteToRestore = trashNotes.find(note => note.id === id);
    
    if (!noteToRestore) {
      failToast('Note not found in Trash.');
      return;
    }

    const updatedTrashNotes = trashNotes.filter(note => note.id !== id);
    const existingNotes = loadNotes();
    const updatedNotes = [...existingNotes, noteToRestore];
    localStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
    localStorage.setItem(TRASH_KEY, JSON.stringify(updatedTrashNotes));
    
    setNotes(updatedNotes);
    setTrashNotes(updatedTrashNotes);
    
    successToast('Note restored successfully.');
    navigate('/');
  } catch (error) {
    failToast(`Failed to restore note: ${error}`);
  }
};


export const editNote = (
  id: string,
  title: string,
  body: string,
  navigate: (path: string) => void
): void => {
  try {
    const existingNotes = loadNotes();
    const newNotes = existingNotes.map(note =>
      note.id === id ? { ...note, title, body } : note
    );
    localStorage.setItem(NOTES_KEY, JSON.stringify(newNotes));
    successToast('Note edited successfully!');
    navigate('/');
  } catch (error) {
    failToast(`Failed to edit note: ${error}`);
  }
};

export const sortNotes = (notes: any[], sortBy: string) => {
  const compareFunctions = {
    title: (a, b) => a.title.localeCompare(b.title),
    dateCreated: (a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(),
    category: (a, b) => a.category.localeCompare(b.category),
  };

  return [...notes].sort(compareFunctions[sortBy] || (() => 0));
};

export const copyNote = (
  id: any[],
  setNotes: React.Dispatch<React.SetStateAction<any[]>>
): void => {

  const existingNotes = loadNotes();
  const noteToCopy = existingNotes.find(note => note.id === id); 

  const copiedNote = {
    ...noteToCopy,
    id: idGen(),
    title: `${noteToCopy.title}`,
    body: `${noteToCopy.body}`,
    color: `${noteToCopy.color}`, 
    category: `${noteToCopy.category}`,
    dateCreated: getCurrentDateTime(),
  };

  const updatedNotes = [...loadNotes(), copiedNote];
  setNotes(updatedNotes);
  localStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));

  successToast('Note copied successfully!');
};

export const notePress = (
  id: string,
  isMultiSelect: boolean,
  navigate: (path: string, params?: any) => void,
  notes: any[],
  selectedNotes: string[],
  setSelectedNotes: React.Dispatch<React.SetStateAction<string[]>>,
  folderNotes?: any[]
): void => {
  const currentNotes = folderNotes || notes;

  if (isMultiSelect) {
    if (selectedNotes.includes(id)) {
      setSelectedNotes(selectedNotes.filter(noteId => noteId !== id));
    } else {
      setSelectedNotes([...selectedNotes, id]);
    }
  } else {
    const selectedNote = currentNotes.find(note => note.id === id);
    navigate('/current-note', { note: selectedNote });
  }
};

export const togglePinNotes = (
  ids: string[],
  setNotes: React.Dispatch<React.SetStateAction<any[]>>
): void => {
  try {
    const existingNotes = loadNotes();

    const updatedNotes = existingNotes.map(note => {
      if (ids.includes(note.id)) {
        return { ...note, tag: note.tag === "important" ? "none" : "important" };
      }
      return note;
    });

    localStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
    setNotes(updatedNotes);

    successToast("Notes updated successfully!");
  } catch (error) {
    failToast(`Failed to update notes: ${error}`);
  }
};


export const unpinNotes = (
  ids: string[],
  setNotes: React.Dispatch<React.SetStateAction<any[]>>
): void => {
  try {
    const existingNotes = loadNotes();

    const updatedNotes = existingNotes.map(note =>
      ids.includes(note.id)
        ? { ...note, tag: "none" }
        : note
    );

    localStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
    setNotes(updatedNotes);

    successToast("Notes pinned successfully!");
  } catch (error) {
    failToast(`Failed to pin notes: ${error}`);
  }
};

//Multi note proccesses

export const moveMultipleNotesToTrash = (
  ids: string[],
  setNotes: React.Dispatch<React.SetStateAction<any[]>>
): void => {
  try {
    const existingNotes = loadNotes(); 
    const trashNotes = loadTrash();
    const notesToTrash = existingNotes.filter(note => ids.includes(note.id));
    const newNotes = existingNotes.filter(note => !ids.includes(note.id));

    localStorage.setItem(NOTES_KEY, JSON.stringify(newNotes));
    setNotes(newNotes);

    const updatedTrashedNotes = [...trashNotes, ...notesToTrash];
    localStorage.setItem(TRASH_KEY, JSON.stringify(updatedTrashedNotes));
    console.log("trashNotes:", trashNotes);

    successToast('Notes moved to trash successfully!');
  } catch (error) {
    failToast(`Failed to move notes to trash: ${error}`);
  }
};

export const deleteMultipleNotes = (
  ids: string,
  setTrashNotes: React.Dispatch<React.SetStateAction<any[]>>,
  navigate: (path: string) => void
): void => {
  try {
    const trashNotes = loadTrash();
    const updatedTrashNotes = trashNotes.filter(note => !ids.includes(note.id));
    localStorage.setItem(TRASH_KEY, JSON.stringify(updatedTrashNotes));
    setTrashNotes(updatedTrashNotes);
    
    successToast('Notes permanently deleted.');
    navigate('/trash');
  } catch (error) {
    failToast(`Failed to permanently delete note: ${error}`);
  }
};

export const restoreMultipleNotes = (
  ids: string,
  setTrashNotes: React.Dispatch<React.SetStateAction<any[]>>,
  setNotes: React.Dispatch<React.SetStateAction<any[]>>,
  navigate: (path: string) => void
): void => {
  try {
    const trashNotes = loadTrash();
    const notesToRestore = trashNotes.filter(note => ids.includes(note.id));
    
    if (!notesToRestore) {
      failToast('Notes not found in Trash.');
      return;
    }

    const updatedTrashNotes = trashNotes.filter(note => !ids.includes(note.id));
    const existingNotes = loadNotes();
    const updatedNotes = [...existingNotes, ...notesToRestore];

    localStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
    localStorage.setItem(TRASH_KEY, JSON.stringify(updatedTrashNotes));
    
    setNotes(updatedNotes);
    setTrashNotes(updatedTrashNotes);
    
    successToast('Note restored successfully.');
    navigate('/');
  } catch (error) {
    failToast(`Failed to restore note: ${error}`);
  }
};