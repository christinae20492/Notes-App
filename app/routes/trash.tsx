import React, { useState, useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import { restoreNote, permanentlyDeleteNote, restoreMultipleNotes, deleteMultipleNotes, loadTrash } from '../utils/noteutility';
import { Modal } from 'antd';
import Layout from '~/components/ui/layout';
import { FormOutlined, ReloadOutlined, DeleteOutlined, CheckCircleFilled } from '@ant-design/icons';
import { MultiSelectCounter } from '~/components/ui/selectcounter';

export default function TrashPage() {
  const [trashNotes, setTrashNotes] = useState([]);
  const navigate = useNavigate();

  const [selectedNotes, setSelectedNotes] = useState([]);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [isOptionsModalVisible, setIsOptionsModalVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [openSorter, setOpenSorter] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  
  useEffect(() => {
    fetchData();
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
      setSelectedNotes(notesArray.map(note => note.id));
    }
  };
  

  const handleRestore = () => {
    const id = selectedNotes.id;
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
    const ids = selectedNotes.map(note => note.id);
    if (selectedNotes.length === 0) {
      alert('Please select notes to delete.');
      return;
    }
    deleteMultipleNotes(ids, setTrashNotes, () => {});
    setSelectedNotes([]); // Clear selected notes
  };

  const handleRestoreSelectedNotes = () => {
    const ids = selectedNotes.map(note => note.id);
    if (selectedNotes.length === 0) {
      alert('Please select notes to restore.');
      return;
    }
    restoreMultipleNotes(ids, setTrashNotes, () => {}, () => {});
    setSelectedNotes([]);
  };

  const openOptionsModal = (note) => {
    if (isMultiSelect===false) {
    setSelectedNote(note);
    setIsOptionsModalVisible(true);}
  };

  const openDeleteConfirmModal = () => {
    setIsDeleteConfirmVisible(true);
  };

  const handleNoteClick = (note) => {
    setCurrentNote(note);
    setModalOpen(true);
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
      setOpenSorter={setOpenSorter}
      setShowSettings={setShowSettings}
      setRefresh={setRefresh}>

      <div className="max-h-1/2 p-8">
        {trashNotes.length === 0 ? (
          <p className="text-lg text-gray-500 text-center font-body">The trash was just taken out.</p>
        ) : (
          <div className="note-container">
            {trashNotes.map((note) => (
              <div
                key={note.id}
                className=""
                onClick={() => openOptionsModal(note)}
              >
                {renderNote(note)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for options (Restore, Delete) */}
      <Modal
        visible={isOptionsModalVisible}
        onCancel={() => setIsOptionsModalVisible(false)}
        footer={null}
      >
        <button onClick={handleRestore} className="p-4 bg-vague rounded-lg">
          Restore Note
        </button><br />
        <button onClick={openDeleteConfirmModal} className="p-4 bg-red text-white rounded-lg">
          Permanently Delete
        </button>
      </Modal>

      {/* Confirmation modal for permanent delete */}
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

      {isMultiSelect && (
        <div className="bg-white rounded-xl min-w-5/6 min-h-6 float-right absolute bottom-4 right-6 ring-2 drop-shadow-md p-2">
          <button
            className="mx-3 scale-150"
            onClick={handleDeleteSelectedNotes}
          >
            <DeleteOutlined />
          </button>
          <button className="mx-3 scale-150" onClick={handleRestoreSelectedNotes}>
            <ReloadOutlined />
          </button>
          <button className={`mx-3 scale-150 ${selectedNotes.length === trashNotes.length ? "text-blue-500" : ""}`} onClick={()=>handleSelectAllNotes(trashNotes)}>
            <CheckCircleFilled />
            </button>
        </div>
      )}
    </Layout>
    </>
  );
}