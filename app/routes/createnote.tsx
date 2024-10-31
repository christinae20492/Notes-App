import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { saveNote } from '../utils/noteutility.js';
import Layout from "~/components/ui/layout.js";
import { warnToast } from "~/utils/toast.js";

export const meta: MetaFunction = () => {
  return [
    { title: "Create a Note" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function CreateNote() {
    
    const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [color, setColor] = useState('');
    const [newNote, setNewNote] = useState('');
    const [category, setCategory] = useState('Personal');
    const [bodyHeight, setBodyHeight] = useState(40);
    const navigation = useNavigate();
    const [isInvalid, setIsInvalid] = useState(false);

     let setIsMultiSelect=null;
      let isMultiSelect=null;
    let  setOpenSorter=null;
      let setShowSettings=null;
     let setRefresh=null;

    const handleSaveNote = (e: React.FormEvent) => {
      e.preventDefault();
  
      if (!title && !body) {
        setIsInvalid(true);
        warnToast("Please provide either the title or body");
        return;
      }
  
      saveNote(title, body, color, category, setNotes, setNewNote, navigation);
      console.log(color);
    };

  return (
    <Layout
      setIsMultiSelect={setIsMultiSelect}
      isMultiSelect={isMultiSelect}
      setOpenSorter={setOpenSorter}
      setShowSettings={setShowSettings}
      setRefresh={setRefresh}
    >
      <div className="flex flex-col flex-none w-full h-2/3 p-4 items-center justify-center ml-18" >
      <form className="w-3/4" onSubmit={handleSaveNote}>
        <input name="title" placeholder="Title" className={`input ${isInvalid ? 'border-2 border-red bg-pink text-black' : ''}`} onChange={(e) => setTitle(e.target.value)}></input>
        <input list="category" name="category" placeholder="Define a category" className="input" />
        <datalist id="category">
          <option value={"Personal"}></option>
          <option value={"School"}></option>
          <option value={"Grocery"}></option>
        </datalist>
        <input type="color" name="color" placeholder="Select the note's color" onChange={(e) => setColor(e.target.value)}></input>
        <textarea name="body" placeholder="Body" className={`input ${isInvalid ? 'border-2 border-red bg-pink text-black' : ''}`} onChange={(e) => setBody(e.target.value)}></textarea>
        <input type="submit" className="submit-button"></input>
      </form>
      </div>
    </Layout>
  )};