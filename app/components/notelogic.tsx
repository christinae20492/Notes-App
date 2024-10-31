import React from 'react';
import { FormOutlined, CheckCircleTwoTone, CheckCircleOutlined } from '@ant-design/icons';

interface NoteItemProps {
  item: {
    id: string;
    title: string;
  };
  isMultiSelect: boolean;
  selectedNotes: string[];
  setSelectedNotes: React.Dispatch<React.SetStateAction<string[]>>;
  navigate: (path: string, params?: any) => void;
  handleDeleteNote: (id: string) => void;
}

export const NoteItem: React.FC<NoteItemProps> = ({ item, isMultiSelect, selectedNotes, setSelectedNotes, navigate, handleDeleteNote }) => {

  const handleNoteClick = () => {
    if (isMultiSelect) {
      setSelectedNotes(prevSelected =>
        prevSelected.includes(item.id)
          ? prevSelected.filter(noteId => noteId !== item.id)
          : [...prevSelected, item.id]
      );
    } else {
      navigate('/viewnote', { noteId: item.id });
    }
  };

  return (
    <div
      className={`"w-1/4 m-1 p-3 border border-gray-300 rounded-md bg-white flex items-center" ${selectedNotes.includes(item.id) ? 'selected-item' : ''}`}
      onClick={handleNoteClick}
      onContextMenu={(e) => {
        e.preventDefault();
        handleDeleteNote(item.id);
      }}>
      <FormOutlined />

      {isMultiSelect && (
        selectedNotes.includes(item.id) ? (
        <CheckCircleOutlined style={{ fontSize: '24px', color: 'blue', ...styles.checkbox }} />
          ) : (
        <CheckCircleTwoTone twoToneColor="black" style={{ fontSize: '24px', ...styles.checkbox }} />
          )
      )}

      
      <div className="text-lg">{item.title}</div>

      <div className="text-base text-gray-500 text-center w-11/12">{item.id}</div>

    </div>
  );
};

// Example styles, you can convert these to CSS classes or use TailwindCSS
const styles = {
  noteItem: {
    padding: '16px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  selectedItem: {
    backgroundColor: '#e0f7ff',
  },
  checkbox: {
    marginLeft: 'auto', // Align checkbox to the right
  },
};