import React, {useEffect, useState, useCallback} from 'react'
//import notes from '../assets/data'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ReactComponent as ArrowLeft } from '../assets/arrow-left.svg'

const NotePage = () => {
  const navigate = useNavigate();

  let { id } = useParams()
  let noteId = Number(id)
  //let note = notes.find(note => note.id === noteId)
  let [note, setNote] = useState({ body: '' })

  useEffect(() => {
    getNote()
  },[noteId])

  let getNote = useCallback(async () => {
    if (noteId === 'new') return;
    try {
      const response = await fetch(`http://localhost:8000/notes/${noteId}`);
      if (!response.ok) {
        throw new Error(`Error fetching note with id ${noteId}: ${response.statusText}`);
      }
      const data = await response.json();
      setNote(data);
    } catch (error) {
      console.error('Failed to fetch the note:', error);
    }
  }, [noteId]);

  let createNote = async () => {
    await fetch(`http://localhost:8000/notes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({...note, 'updated': new Date()})
    })
  }

  let updateNote = async () => {
    await fetch(`http://localhost:8000/notes/${noteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({...note, 'updated': new Date()})
    })
  }

  let deleteNote = async () =>{
    await fetch(`http://localhost:8000/notes/${noteId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note)
    })
    navigate("/")
  }

  let handleSubmit = () =>{
    if(noteId !== 'new' && !note.body){
      deleteNote()
    }
    else if(noteId !== 'new'){
      updateNote()
    }
    else if(note === 'new' && note.body.trim() !== '')
      createNote()
    navigate("/")
  }

  return (
    <div className='note'>
      <div className='note-header'>
        <h3>
          <Link to="/">
            <ArrowLeft onClick={handleSubmit}/>
          </Link>
        </h3>

        {noteId !== 'new' ? (
          <button onClick={deleteNote}>Delete</button>
        ) : (
          <button onClick={handleSubmit}>Done</button>
        )}

      </div>

        <textarea onChange={(e) => setNote({...note, 'body':e.target.value})} value={note? note.body: ' '}>
        </textarea>
    </div>
  )
}

export default NotePage