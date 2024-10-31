import React from 'react'

interface MultiSelectProps {
    selectedNotes: any[];
  }

export const MultiSelectCounter:React.FC<MultiSelectProps>=({selectedNotes})=>{

  const count = selectedNotes.length;

  return (
    <div className="w-full h-28 absolute top-0 bg-white shadow-md -ml-4">
        <h1 className="text-2xl p-6 font-semibold font-header">{count} selected</h1>
    </div>
  )
}