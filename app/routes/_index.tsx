import type { MetaFunction } from "@remix-run/node";
import React, { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import {
  loadNotes,
  deleteNote,
  moveMultipleNotesToTrash,
  togglePinNotes,
} from "../utils/noteutility";
import {
  createFolder,
  loadFolders,
  moveNoteToFolder,
  addNotesToFolder,
} from "../utils/folderutil";
import {
  FormOutlined,
  DeleteOutlined,
  SwapOutlined,
  PushpinOutlined,
  FolderOpenOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { SortPicker } from "~/components/sorter";
import { NoteModal } from "~/components/notemodal";
import Layout from "~/components/ui/layout";
import { MultiSelectCounter } from "~/components/ui/selectcounter";

export const meta: MetaFunction = () => {
  return [
    { title: "Notes App" },
    { name: "description", content: "Murmuring to myself..." },
  ];
};

export default function Index() {
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [newFolder, setNewFolder] = useState("");
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [notesToCopy, setNotesToCopy] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [textInputVisible, setTextInputVisible] = useState(false);
  const [openSorter, setOpenSorter] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [longPressedNote, setLongPressedNote] = useState(null);
  const [inputText, setInputText] = useState("New folder");
  const navigate = useNavigate();

  const pinnedNotes = notes.filter((note) => note.tag === "important");
  const regularNotes = notes.filter((note) => note.tag !== "important");

  const [currentNote, setCurrentNote] = useState("");

  const handleNoteClick = (note: React.SetStateAction<null>) => {
    setCurrentNote(note);
    setModalOpen(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!isMultiSelect) {
      setSelectedNotes([]);
    }
  }, [isMultiSelect]);

  const fetchData = async () => {
    setLoading(true);
    const loadedNotes = await loadNotes();
    const loadedFolders = await loadFolders();
    setNotes(Array.isArray(loadedNotes) ? loadedNotes : []);
    setFolders(Array.isArray(loadedFolders) ? loadedFolders : []);
    setLoading(false);
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    fetchData();
    setIsModalVisible(false);
  };

  const handleSaveNote = (updatedContent: any) => {
    const updatedNote = { ...currentNote, content: updatedContent };
    console.log("Updated note:", updatedNote);
    setModalOpen(false);
  };

  const handleSelectAllNotes = (notesArray) => {
    if (selectedNotes.length === notesArray.length) {
      setSelectedNotes([]);
    } else {
      setSelectedNotes(notesArray.map(note => note.id));
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createFolder(inputText, setFolders, setNewFolder, setTextInputVisible);
  };

  const openModal = (note: any) => {
    setLongPressedNote(note);
    setIsModalVisible(true);
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
      <div
        className="fixed w-5 h-14 rounded-lg"
        style={{ backgroundColor: note.color }}
      ></div>
      <div>{note.title}</div>
      <div>{note.id}</div>
    </div>
  );

  const renderPinnedNote = (note: any) => (
    <div
      key={note.id}
      className={`note-item font-semibold bg-lightgrey w-3/4 ${
        selectedNotes.includes(note.id) ? "selected-note bg-blue" : ""
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
      <div
        className="fixed w-2 h-8 rounded-lg outline-1 outline-black"
        style={{ backgroundColor: note.color }}
      ></div>
      <div>{note.title}</div>
    </div>
  );

  const renderFolder = (folder: any) => (
    <div
      key={folder.id}
      className="folder-item"
      onClick={() =>
        navigate(`/viewfolder/${encodeURIComponent(folder.id)}`, {
          state: { folder },
        })
      }
    >
      <FolderOpenOutlined style={{ color: "steelblue", scale: "1.5" }} />
      <br />
      {folder.title}
    </div>
  );

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
        <div className="bg-lightgrey p-8 rounded-lg shadow-lg w-lg text-center">
          {folders.length === 0 ? (
            <p className="text-lg text-gray-500 text-center">
              You don't have any folders...yet!
            </p>
          ) : (
            <div className="note-container">
              {folders.map((folder) => (
                <div key={folder.id}>{renderFolder(folder)}</div>
              ))}
            </div>
          )}
          <button
            className="submit-button"
            onClick={() => setTextInputVisible(!textInputVisible)}
          >
            Add New Folder
          </button>
          {textInputVisible && (
            <form>
              <input
                type="text"
                className="p-1 rounded-l-md"
                placeholder="Name your folder"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              ></input>
              <input
                type="submit"
                className="bg-steelgrey p-2 text-sm text-white rounded-r-md"
                onClick={handleFormSubmit}
              ></input>
            </form>
          )}
        </div>

        <SortPicker
          isOpen={openSorter}
          setIsModalVisible={setOpenSorter}
          notes={notes}
          setNotes={setNotes}
        />

        <div className="max-h-1/2 p-4 justify-around">
          {pinnedNotes.length === 0 ? (
            <div className="hidden">
              <p>null</p>
            </div>
          ) : (
            <div className="note-container">
              {pinnedNotes.map((note) => (
                <div key={note.id}>{renderPinnedNote(note)}</div>
              ))}
            </div>
          )}
        </div>

        <div className="max-h-3/4 justify-around">
          {notes.length === 0 ? (
            <p className="text-lg text-gray-500 text-center font-body">
              No notes available. Add a note to get started!
            </p>
          ) : (
            <div className="note-container">
              {regularNotes.map((note) => (
                <div key={note.id}>{renderNote(note)}</div>
              ))}
            </div>
          )}
        </div>

        {isMultiSelect && (
          <div className="bg-white rounded-xl min-w-5/6 min-h-6 float-right absolute bottom-4 right-6 ring-2 drop-shadow-md p-2">
            <button
              className="mx-3 scale-150"
              onClick={() => moveMultipleNotesToTrash(selectedNotes, setNotes)}
            >
              <DeleteOutlined />
            </button>
            <button className="mx-3 scale-150" onClick={() => addNotesToFolder}>
              <SwapOutlined />
            </button>
            <button
              className="mx-3 scale-150"
              onClick={() => togglePinNotes(selectedNotes, setNotes)}
            >
              <PushpinOutlined />
            </button>
            <button className={`mx-3 scale-150 ${selectedNotes.length === notes.length ? "text-blue-500" : ""}`} onClick={()=>handleSelectAllNotes(notes)}>
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
          isInFolder={false}
        />
      </Layout>
    </>
  );
}
