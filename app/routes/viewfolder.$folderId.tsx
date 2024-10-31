import { MetaFunction } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from '@remix-run/react';
import { deleteNote, loadNotes, moveMultipleNotesToTrash, copyNote } from '../utils/noteutility';
import { addNotesToFolder, deleteFolder, loadFolders, removeNotesFromFolder, renameFolder } from '~/utils/folderutil';
import { FormOutlined, DeleteOutlined, MinusOutlined, BlockOutlined, CheckCircleFilled } from '@ant-design/icons';
import Layout from '~/components/ui/layout';
import { NoteModal } from "~/components/notemodal";
import { MultiSelectCounter } from "~/components/ui/selectcounter";

export const meta: MetaFunction = ({ data }) => {
    return [
      { title: data ? data.title : "View Folder" },
      { name: "description", content: "View your folder's notes" }
    ];
};

export default function ViewFolder() {
    const { folderId } = useParams();
    const decodedFolderId = decodeURIComponent(folderId);
    const navigate = useNavigate();
    
    const [folder, setFolder] = useState(null);
    const [folders, setFolders] = useState([]);
    const [notes, setNotes] = useState([]);
    const [mainNotes, setMainNotes] = useState([]);
    const [selectedNotes, setSelectedNotes] = useState([]);
    const [noteModalVisible, setNoteModalVisible] = useState(false);

    const [isMultiSelect, setIsMultiSelect] = useState(false);
    const [openSorter, setOpenSorter] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentNote, setCurrentNote] = useState('');
    const [isEditingTitle, setIsEditingTitle]=useState(false);
    const [folderTitle, setFolderTitle] = useState<string>("");

    const fetchData = async () => {
      const loadedFolders = await loadFolders();
      const foldersArray = Array.isArray(loadedFolders) ? loadedFolders : [];
      setFolders(foldersArray);
      return foldersArray;
    };

    const fetchFolderNotes = async () => {
      const folders = await loadFolders();
      const currentFolder = folders.find(folder => folder.id === decodedFolderId);
      setNotes(currentFolder?.notes || []);
    };    

    const fetchNotes = async () =>{
      const loadedNotes = await loadNotes();
      const notesArray = Array.isArray(loadedNotes) ? loadedNotes : [];
      setMainNotes(notesArray);
      return mainNotes;
    }
    
    useEffect(() => {
      const fetchAndFindFolder = async () => {
        const loadedFolders = await fetchData();
        const foundFolder = loadedFolders.find((f) => f.id === decodedFolderId);
        
        if (!foundFolder) {
          navigate("/404");
          console.log('Folder not found');
        } else {
          setFolder(foundFolder);
          setFolderTitle(foundFolder.title || "");
          setNotes(foundFolder.notes || []);
        }
      };
    
      fetchAndFindFolder();
    }, [decodedFolderId, navigate]);

    useEffect(() => {
      fetchNotes();
    }, []);

    useEffect(() => {
      if (!isMultiSelect) {
        setSelectedNotes([]);
      }
    }, [isMultiSelect]);

    const handleSelectAllNotes = (notesArray) => {
      if (selectedNotes.length === notesArray.length) {
        setSelectedNotes([]);
      } else {
        setSelectedNotes(notesArray.map(note => note.id));
      }
    };
    
    
    const handleDeleteFolder = async () => {
      if (window.confirm("Are you sure you want to delete this folder?")) {
        await deleteFolder(folder.id, setFolders, setNotes);
        setNotes(prevNotes => [...prevNotes, ...folder.notes]); // Add notes back to main array
        navigate("/");  // Redirect to home after deletion
      }
    };
    
    const handleDeleteNote = (id: string) => {
      deleteNote(id, setNotes, navigate);
      fetchFolderNotes();
      setNoteModalVisible(false);
    };

    const handleSaveNote = (updatedContent: any) => {
      const updatedNote = { ...currentNote, content: updatedContent };
      console.log("Updated note:", updatedNote);
      setModalOpen(false);
    };

    const handleAddNotes = async () => {
      await addNotesToFolder(selectedNotes, folder.id, setNotes, setFolders);
      setNoteModalVisible(false);
      setSelectedNotes([]);
      fetchFolderNotes();
    };
    

    const handleRenameFolder = (e) => {
      if (e.key === "Enter") {
        renameFolder(decodedFolderId, folderTitle, setFolders, setIsEditingTitle);
      }
    };
    
    
    const handleMoveToTrash = () => {
  const folderNotes = folder.notes.filter(note => !selectedNotes.includes(note.id));
  
  moveMultipleNotesToTrash(selectedNotes, setNotes);

  setFolder({ ...folder, notes: folderNotes });
  setSelectedNotes([]);
  fetchFolderNotes();
    };
    
    const handleCopyNotes = () => {
      copyNote(selectedNotes, setNotes);
      setSelectedNotes([]);
    };
    
    const handleRemoveNotes = () => {
      removeNotesFromFolder(selectedNotes.map(note => note.id), folder.id, setNotes, setFolders, navigate);
      setSelectedNotes([]);
      fetchFolderNotes();
    };
    

    const renderNote = (note: any) => (
      <div
        key={note.id}
        className={`note-item ${
          selectedNotes.includes(note.id) ? "selected-note" : ""
        }`}
        onClick={() => {
          if (isMultiSelect) {
            setSelectedNotes((prev) => {
              return prev.includes(note.id)
                ? prev.filter((id) => id !== note.id)
                : [...prev, note.id];
            });
          } else {
            handleNoteClick(note);
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          openModal(note);
        }}
      >
        <div>
          <FormOutlined />
        </div>
        <div className="fixed w-5 h-14 rounded-lg" style={{ backgroundColor: note.color }}></div>
        <div>{note.title}</div>
        <div>{note.id}</div>
      </div>
    );

    const renderMainNotes = (note: any) => (
      <div
        key={note.id}
        className={`note-item ${
          selectedNotes.includes(note.id) ? "selected-note" : ""
        }`}
        onClick={() => {
            setSelectedNotes((prev) => {
              return prev.includes(note.id)
                ? prev.filter((id) => id !== note.id)
                : [...prev, note.id];
          })
        }}
      >
        <div>
          <FormOutlined />
        </div>
        <div className="fixed w-5 h-14 rounded-lg" style={{ backgroundColor: note.color }}></div>
        <div>{note.title}</div>
        <div>{note.id}</div>
      </div>
    );

    const handleNoteClick = (note) => {
        setCurrentNote(note);
        setModalOpen(true);
    };

    if (!folder) {
        return <div>Loading...</div>;  
    }

    return (

      <>

{isMultiSelect && <MultiSelectCounter selectedNotes={selectedNotes} />}
        <Layout
          setIsMultiSelect={setIsMultiSelect}
          isMultiSelect={isMultiSelect}
          setOpenSorter={setOpenSorter}
          setShowSettings={setShowSettings}
          setRefresh={setRefresh}
        >
          <div className="bg-white top-28 left-24 h-12 w-[calc(100%-6rem)] fixed p-3 text-center shadow-md">
          <h1 className="text-2xl font-header shadow-sm" onDoubleClick={() => setIsEditingTitle(true)}>
  {isEditingTitle ? (
    <input
      className="text-center rounded-md outline-darkgrey"
      type="text"
      value={folderTitle}
      onChange={(e) => setFolderTitle(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleRenameFolder()}
      onBlur={handleRenameFolder}
      autoFocus
    />
  ) : (
    folderTitle
  )}
</h1>

          </div>

          <div className="bg-white top-40 left-24 h-22 w-[calc(100%-6rem)] fixed p-3 shadow-md">
            <button
              className="button bg-red"
              onClick={() => handleDeleteFolder(folder.id)}
            >
              Delete Folder
            </button>
            <button className="button">
              Rename
            </button>
            <button className="button bg-pastelblue" onClick={()=>setNoteModalVisible(true)}>
              Add Notes
            </button>
          </div>

          <div className="w-5/6 max-h-5/6 p-5 mt-32 justify-around">
            {notes.length === 0 ? (
              <p className="text-lg text-gray-500 text-center font-body">
                Aww, this folder's empty.
              </p>
            ) : (
              <div className="note-container">
                {notes.map((note) => (
                  <div key={note.id}>
                    {renderNote(note)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {noteModalVisible && (
            <div className="modal-backdrop">
              <div className="modal-main bg-white h-3/4 w-5/6">
                <button className="button w-16 bg-red" onClick={()=>setNoteModalVisible(false)}>
                  x
                </button>
                <div className="outline-2 outline-red max-h-1/2 p-8 justify-around overflow-y-scroll">
                  <div className="note-container">
                    {mainNotes.map((note) => (
                      <div key={note.id}>{renderMainNotes(note)}</div>
                    ))}
                  </div>
                </div>
                <button className="button" onClick={handleAddNotes}>Add To Folder</button>
              </div>
            </div>
          )}

        {isMultiSelect && (
          <div className="bg-white rounded-xl min-w-5/6 min-h-6 float-right absolute bottom-4 right-6 ring-2 drop-shadow-md p-2">
            <button
              className="mx-3 scale-150"
              onClick={handleMoveToTrash}
            >
              <DeleteOutlined />
            </button>
            <button className="mx-3 scale-150" onClick={handleRemoveNotes}>
            <MinusOutlined />
            </button>
            <button className={`mx-3 scale-150 ${selectedNotes.length === notes.length ? "text-blue-500" : ""}`} onClick={()=>handleSelectAllNotes(folder.notes)}>
            <CheckCircleFilled />
            </button>
          </div>
        )}

          <NoteModal
          isOpen={isModalOpen}
          note={currentNote}
          onClose={() => setModalOpen(false)}
          onSaveNote={handleSaveNote}
          setNotes={setNotes}
          navigate={navigate}
          isInFolder={true}
        />
        </Layout>
        </>
    );
}