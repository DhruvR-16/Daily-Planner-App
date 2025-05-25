import React, { useState, useEffect } from "react";
import { format } from "date-fns";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const getRandomColor = () => {
    const colors = [
      "bg-yellow-50 border-yellow-200",
      "bg-blue-50 border-blue-200",
      "bg-green-50 border-green-200",
      "bg-pink-50 border-pink-200",
      "bg-purple-50 border-purple-200",
      "bg-indigo-50 border-indigo-200",
      "bg-orange-50 border-orange-200",
      "bg-red-50 border-red-200",
      "bg-teal-50 border-teal-200",
      "bg-lime-50 border-lime-200",
      "bg-fuchsia-50 border-fuchsia-200",
      "bg-gray-50 border-gray-200",
      "bg-cyan-50 border-cyan-200",
      "bg-amber-50 border-amber-200",
      "bg-emerald-50 border-emerald-200",
      "bg-rose-50 border-rose-200"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  
  useEffect(() => {
    try {
      const storedNotes = localStorage.getItem("notes");
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        setNotes(parsedNotes);
      }
    } catch (error) {
      console.error("Error loading notes from localStorage:", error);
    }
  }, []);


  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("notes", JSON.stringify(notes));
    }
  }, [notes]);


  const addNote = () => {
    if (!currentNote.trim()) return;
    
    const newNote = {
      id: Date.now(),
      content: currentNote,
      timestamp: new Date().toISOString(),
      color: getRandomColor()
    };
    

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    

    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    
    setCurrentNote("");
  };


  const updateNote = () => {
    if (!currentNote.trim() || !editingNote) return;
    
    const updatedNotes = notes.map(note =>
      note.id === editingNote.id 
        ? { 
            ...note, 
            content: currentNote,
            updatedAt: new Date().toISOString() 
          } 
        : note
    );
    

    setNotes(updatedNotes);
    

    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    
    setCurrentNote("");
    setEditingNote(null);
  };


  const deleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    

    setNotes(updatedNotes);
    

    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    
    if (editingNote && editingNote.id === id) {
      setCurrentNote("");
      setEditingNote(null);
    }
  };


  const startEditing = (note) => {
    setEditingNote(note);
    setCurrentNote(note.content);
  };


  const cancelEditing = () => {
    setEditingNote(null);
    setCurrentNote("");
  };


  const filteredNotes = notes.filter(note =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const sortedNotes = [...filteredNotes].sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.timestamp);
    const dateB = new Date(b.updatedAt || b.timestamp);
    
    if (sortOrder === "newest") {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });


  const formatTimestamp = (timestamp) => {
    return format(new Date(timestamp), "MMM d, yyyy 'at' h:mm a");
  };




  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Notes</h1>


      <div className="mb-8 bg-white rounded-lg shadow-sm p-4">
        <div className="mb-2 flex justify-between items-center">
          <h2 className="font-medium text-gray-800">
            {editingNote ? "Edit Note" : "Create New Note"}
          </h2>
          {editingNote && (
            <button
              onClick={cancelEditing}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel Editing
            </button>
          )}
        </div>
        <textarea
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          placeholder="Type your note here..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0fbcf9] min-h-[120px]"
        ></textarea>
        <div className="flex justify-end mt-3">
          <button
            onClick={editingNote ? updateNote : addNote}
            disabled={!currentNote.trim()}
            className={`px-4 py-2 bg-[#0fbcf9] text-white rounded-md hover:bg-[#3dbfee] transition-colors flex items-center ${!currentNote.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              {editingNote ? (
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              ) : (
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              )}
            </svg>
            {editingNote ? "Update Note" : "Add Note"}
          </button>
        </div>
      </div>


      <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0fbcf9]"
              />
            </div>
          </div>
          
          <div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0fbcf9]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>


      {sortedNotes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#0fbcf9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No notes found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm 
              ? "Try adjusting your search terms" 
              : "Start by adding your first note"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedNotes.map((note) => (
            <div
              key={note.id}
              className={`${note.color} border rounded-lg shadow-sm overflow-hidden`}
            >
              <div className="p-4">
                <p className="whitespace-pre-wrap break-words mb-3">
                  {note.content}
                </p>
                <div className="flex justify-between items-end mt-4 pt-2 border-t border-gray-200 text-gray-500 text-xs">
                  <div>
                    {note.updatedAt ? (
                      <>
                        <div>Updated: {formatTimestamp(note.updatedAt)}</div>
                        <div>Created: {formatTimestamp(note.timestamp)}</div>
                      </>
                    ) : (
                      <div>Created: {formatTimestamp(note.timestamp)}</div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(note)}
                      className="p-1 hover:text-[#0fbcf9] transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-1 hover:text-red-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notes;