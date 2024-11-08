import React, { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import {
  restoreNote,
  permanentlyDeleteNote,
  restoreMultipleNotes,
  deleteMultipleNotes,
  loadTrash,
} from "../utils/noteutility";
import { Modal } from "antd";
import Layout from "~/components/ui/layout";
import {
  FormOutlined,
  ReloadOutlined,
  DeleteOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { MultiSelectCounter } from "~/components/ui/selectcounter";
import { getTrash, saveTrash } from "~/utils/localStorage";
import { Note } from "~/utils/types";
import { failToast, warnToast } from "~/utils/toast";
import { NoteModal } from "~/components/notemodal";
import NoteItem from "~/components/notelogic";

export default function TrashPage() {
  const [trashNotes, setTrashNotes] = useState([]);
  const navigate = useNavigate();

  const [selectedNotes, setSelectedNotes] = useState([]);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [isOptionsModalVisible, setIsOptionsModalVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchBar, setSearchBar] = useState(false);
  const [openSorter, setOpenSorter] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    removeExpiredNotes();
    fetchData();
    warnToast('Notes that\'ve been trashed 7 days ago will automatically be permanently deleted.')
  }, []);

  useEffect(() => {
    if (!isMultiSelect) {
      setSelectedNotes([]);
    }
  }, [isMultiSelect]);

  const fetchData = async () => {
    const loadedNotes = await loadTrash();
    setTrashNotes(loadedNotes);
  };

  const handleSelectAllNotes = (notesArray) => {
    if (selectedNotes.length === notesArray.length) {
      setSelectedNotes([]);
    } else {
      setSelectedNotes(notesArray.map((note) => note.id));
    }
  };

  const handleRestore = () => {
    if (selectedNote) {
      restoreNote(id, setTrashNotes, setNotes, navigate);
      setIsOptionsModalVisible(false);
    }
  };

  const handlePermanentDelete = () => {
    if (selectedNote) {
      permanentlyDeleteNote(selectedNote.id, setTrashNotes, navigate);
      setIsDeleteConfirmVisible(false);
      setIsOptionsModalVisible(false);
    }
  };

  const handleDeleteSelectedNotes = () => {
    if (selectedNotes.length === 0) {
      alert("Please select notes to delete.");
      return;
    }
    deleteMultipleNotes(selectedNotes, setTrashNotes, () => {});
    setSelectedNotes([]); 
  };

  const handleRestoreSelectedNotes = () => {
    if (selectedNotes.length === 0) {
      alert("Please select notes to restore.");
      return;
    }
    restoreMultipleNotes(
      selectedNotes,
      setTrashNotes,
      () => {},
      () => {}
    );
    setSelectedNotes([]);
  };

  const handleNoteClick = (note) => {
    setCurrentNote(note);
    setModalOpen(true);
  };

  const removeExpiredNotes = (): void => {
    try {
      const trashNotes = getTrash();
      const nonExpiredNotes: Note[] = [];
      const now = Date.now();
  
      trashNotes.forEach(note => {
        const dateDeleted = new Date(note.dateDeleted!).getTime();
        const ageInDays = (now - dateDeleted) / (1000 * 60 * 60 * 24);
  
        if (ageInDays >= 6 && ageInDays < 7) {
          warnToast(`Warning: Note "${note.title}" will be permanently deleted in 1 day.`);
        }
  
        if (ageInDays < 7) {
          nonExpiredNotes.push(note);
        }
      });
  
      if (nonExpiredNotes.length !== trashNotes.length) {
        saveTrash(nonExpiredNotes);
      }
    } catch (error) {
      failToast(`Failed to remove expired notes: ${error}`);
    }
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
    >
      <div>
        <FormOutlined />
      </div>
      <div>{note.title}</div>
      <div>{note.id}</div>
    </div>
  );

  return (
    <>
      {isMultiSelect && <MultiSelectCounter selectedNotes={selectedNotes} />}
      <Layout
        setIsMultiSelect={setIsMultiSelect}
        isMultiSelect={isMultiSelect}
        setSearchBar={setSearchBar}
        searchBar={searchBar}
        setOpenSorter={setOpenSorter}
        setShowSettings={setShowSettings}
        setRefresh={setRefresh}
      >
        <div className="max-h-1/2 p-8">
          {trashNotes.length === 0 ? (
            <p className="text-lg text-gray-500 text-center font-body">
              The trash was just taken out.
            </p>
          ) : (
            <div className="note-container">
              {trashNotes.map((note) => (
                <div
                  key={note.id}
                  className=""
                >
                  <NoteItem
                key={note.id}
                note={note}
                isSelected={selectedNotes.includes(note.id)}
                isPinned={false}
                isMultiSelect={isMultiSelect}
                onClick={handleNoteClick}
              />
                </div>
              ))}
            </div>
          )}
        </div>

        <Modal
          visible={isDeleteConfirmVisible}
          onCancel={() => setIsDeleteConfirmVisible(false)}
          onOk={handlePermanentDelete}
          okText="Delete"
          cancelText="Cancel"
          title="Confirm Delete"
        >
          Are you sure you want to permanently delete this note?
        </Modal>

        <NoteModal 
        isOpen={isModalOpen}
        note={currentNote}
        onClose={() => setModalOpen(false)}
        onSaveNote={null}
        setNotes={null}
        setTrashNotes={setTrashNotes}
        navigate={navigate}
        isInFolder={false}
          isInTrash={true}
          folderId={undefined}
        />

        {isMultiSelect && (
          <div className="bg-white rounded-xl min-w-5/6 min-h-6 float-right absolute bottom-4 right-6 ring-2 drop-shadow-md p-2">
            <button
              className="mx-3 scale-150"
              onClick={handleDeleteSelectedNotes}
            >
              <DeleteOutlined />
            </button>
            <button
              className="mx-3 scale-150"
              onClick={handleRestoreSelectedNotes}
            >
              <ReloadOutlined />
            </button>
            <button
              className={`mx-3 scale-150 ${
                selectedNotes.length === trashNotes.length
                  ? "text-blue-500"
                  : ""
              }`}
              onClick={() => handleSelectAllNotes(trashNotes)}
            >
              <CheckCircleFilled />
            </button>
          </div>
        )}
      </Layout>
    </>
  );
}
