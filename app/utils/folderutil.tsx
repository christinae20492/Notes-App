import { loadNotes } from './noteutility';
import { successToast, failToast } from './toast';
import { idGen, getCurrentDateTime } from './rangen';

const FOLDERS_KEY = 'folders';
const NOTES_KEY = 'notes';

// Load Folders Function (using localStorage)
export const loadFolders = () => {
  try {
    const jsonValue = localStorage.getItem(FOLDERS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    failToast(`Failed to load folders: ${error}`);
    return [];
  }
};

export const createFolder = (folderName: string, setFolders: (arg0: any[]) => void, setNewFolder: (arg0: string) => void, setTextInputVisible: (arg0: boolean) => void) => {
  try {
    const existingFolders = loadFolders();
    const newFolder = { title: folderName, id: idGen(), dateCreated: getCurrentDateTime(), notes: [] };
    const newFolders = [...existingFolders, newFolder];

    setFolders(newFolders);
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(newFolders));
    setNewFolder('');
    setTextInputVisible(false);

    successToast('New folder created!');
  } catch (error) {
    failToast(`Folder creation failed: ${error}`);
  }
};

export const moveNoteToFolder = (noteId: string, folderId: string, setNotes: (arg0: any) => void, setFolders: (arg0: any) => void, navigation: { navigate: (arg0: string) => void }) => {
  try {
    const existingNotes = loadNotes();
    const existingFolders = loadFolders();

    const note = existingNotes.find((n: { id: any }) => n.id === noteId);
    if (!note) {
      throw new Error('Note not found');
    }

    const updatedNotes = existingNotes.filter((n: { id: any }) => n.id !== noteId);
    const updatedFolders = existingFolders.map((folder: { id: any; notes: any }) => {
      if (folder.id === folderId) {
        return { ...folder, notes: [...folder.notes, note] };
      }
      return folder;
    });

    setNotes(updatedNotes);
    setFolders(updatedFolders);

    localStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(updatedFolders));

    successToast('Note moved to folder successfully!');
    navigation.navigate('Home');
  } catch (error) {
    failToast(`Failed to move note to folder: ${error}`);
    console.log(error);
  }
};

export const addNotesToFolder = (noteIds: string[], folderId: string, setNotes: (arg0: any) => void, setFolders: (arg0: any) => void) => {
  try {
    const notes = JSON.parse(localStorage.getItem(NOTES_KEY) || '[]');
    const folders = JSON.parse(localStorage.getItem(FOLDERS_KEY) || '[]');

    const selectedNotes = notes.filter((note: { id: any }) => noteIds.includes(note.id));
    const remainingNotes = notes.filter((note: { id: any }) => !noteIds.includes(note.id));

    const folderIndex = folders.findIndex((folder: { id: any }) => folder.id === folderId);
    if (folderIndex === -1) {
      throw new Error('Folder not found');
    }

    folders[folderIndex].notes = [...folders[folderIndex].notes, ...selectedNotes];

    setNotes(remainingNotes);
    setFolders(folders);
    successToast('Notes added to folder');

    localStorage.setItem(NOTES_KEY, JSON.stringify(remainingNotes));
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
  } catch (error) {
    failToast(`Failed to add notes to folder: ${error}`);
  }
};

export const removeNotesFromFolder = (noteIds: string[], folderId: string, setNotes: (arg0: any) => void, setFolders: (arg0: any) => void, navigation: { navigate: (arg0: string) => void }) => {
  try {
    const notes = JSON.parse(localStorage.getItem(NOTES_KEY) || '[]');
    const folders = JSON.parse(localStorage.getItem(FOLDERS_KEY) || '[]');

    const folderIndex = folders.findIndex((folder: { id: any }) => folder.id === folderId);
    if (folderIndex === -1) {
      throw new Error('Folder not found');
    }

    const selectedNotes = folders[folderIndex].notes.filter((note: { id: any }) => noteIds.includes(note.id));
    folders[folderIndex].notes = folders[folderIndex].notes.filter((note: { id: any }) => !noteIds.includes(note.id));

    const updatedNotes = [...notes, ...selectedNotes];

    setNotes(updatedNotes);
    setFolders(folders);
    successToast('Notes removed from folder');
    navigation.navigate('Home');

    localStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
  } catch (error) {
    failToast(`Failed to remove notes from folder: ${error}`);
  }
};

export const deleteFolder = async (
  folderId: string,
  setFolders: React.Dispatch<React.SetStateAction<any[]>>,
  setNotes: React.Dispatch<React.SetStateAction<any[]>>,
  navigate: (path: string) => void
): Promise<void> => {
  try {
    const existingFolders = loadFolders();
    const mainNotes = loadNotes();
    const folderToDelete = existingFolders.find((folder) => folder.id === folderId);

    if (!folderToDelete) {
      throw new Error(`Folder with ID ${folderId} not found.`);
    }

    const folderNotes = folderToDelete.notes || []; // Ensure notes defaults to an empty array if undefined
    const updatedNotes = [...mainNotes, ...folderNotes];
    localStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
    setNotes(updatedNotes);

    const updatedFolders = existingFolders.filter((folder) => folder.id !== folderId);
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(updatedFolders));
    setFolders(updatedFolders);

    successToast('Folder deleted successfully!');
    navigate('/');
  } catch (error) {
    console.error("Error deleting folder:", error);
    failToast(`Failed to delete folder: ${error}`);
  }
};

export const renameFolder = (
  folderId: string,
  newTitle: string,
  setFolders: React.Dispatch<React.SetStateAction<any[]>>,
  setIsEditingTitle: (arg0: boolean) => void
): void => {
  const folders = loadFolders();
  const updatedFolders = folders.map(folder =>
    folder.id === folderId ? { ...folder, title: newTitle } : folder
  );

  localStorage.setItem(FOLDERS_KEY, JSON.stringify(updatedFolders));
  setFolders(updatedFolders);
  setIsEditingTitle(false);
  successToast('Folder renamed successfully!');
};
