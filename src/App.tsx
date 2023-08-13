import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Navigate, Route, Routes } from "react-router-dom";
import { NewNote } from "./NewNote";
import { NoteLayout } from "./NoteLayout";
import { useLocalStorage } from "./useLocalStorage";
import { useMemo } from "react";
import {v4 as uuidV4} from "uuid";
import { NoteList } from "./NoteList";
import { Note } from "./Note";
import { EditNote } from "./EditNote";


// defining types

export type Note = {
  id: string
} & NoteData

export type NoteData = {
  title: string,
  tags: Tag[],
  markdown: string,
}

// using raw note as if we cange the value of the tag don't want to update value
// of tag in every note so use this.
// just want to update the tag stored in local storage then automatically propgate that change
//as it is known tagid is correct id
export type RawNote = {
  id: string
} & RawNoteData

export type RawNoteData = {
  title: string,
  tagIds: string[],
  markdown: string,
}

export type Tag = {
  id: string,
  label: string,
}


function App() {
  // set state using local storage so it persists.
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", [])
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", [])

  // convert raw notes to actual notes useMemo to cache these
  const notesWithTags = useMemo(() => {
    // loop through all the notes keep the current info but also get the tags with ids that's being stored.
    return notes.map(note => {
      return {...note, tags: tags.filter(tag => note.tagIds.includes(tag.id))}
    })
  }, [notes, tags])

  // function to handle creation of a note which when called saves this to note array stored in localstorage
  function onCreateNote({tags, ...data}:NoteData) {

    setNotes( prevNotes => {
      // all the previous notes plus new one with NoteData but need to convert to Raw note data.
      // so instead of storing the tag is self stores the id.
      return [...prevNotes, {...data, id: uuidV4(), tagIds: tags.map(tag => tag.id)},  ]
    }
    )
  }

  function onUpdateNote(id:string, {tags, ...data}:NoteData) {


    setNotes( prevNotes => {
      return prevNotes.map(
        note=> {if (note.id === id){
          return {...note, ...data, tagIds: tags.map(tag => tag.id)}
        }else {
          return note
        }
      }
      )

      // all the previous notes plus new one with NoteData but need to convert to Raw note data.
      // so instead of storing the tag is self stores the id.
      // return [...prevNotes, ,  ]
    }
    )
  }

  function onDeleteNote(id:string) {
    setNotes( prevNotes => {
      return prevNotes.filter(note => note.id !== id)
    })
  }

  function addTag(tag:Tag) {
    setTags(prev => [...prev, tag])
  }

  // function updateTag(id:string, label:string) {
  //   setTags( (prevTags) => {
  //     return prevTags.map(
  //       (tag)=> {if (tag.id === id){
  //         return {...tag, label: label }
  //       }else {
  //         return tag
  //       }
  //     }
  //     )
  //   }
  //   )
  // }

  function updateTag(id: string, label: string) {
    try {
      setTags((prevTags) => {
        return prevTags.map((tag) => {
          if (tag.id === id) {
            return { ...tag, label: label };
          } else {
            return tag;
          }
        });
      });
    } catch (error) {
      console.error("Error updating tag:", error);
    }
  }

  function deleteTag(id:string) {
    setTags( prevTags => {
      return prevTags.filter(tag => tag.id !== id)
    })
  }

  return (

    <Container className="my-4">
      <Routes>
        {/* home path */}
        <Route path="/" element={
          <NoteList
            notes={notesWithTags}
            availableTags={tags}
            onUpdateTag ={updateTag}
            onDeleteTag ={deleteTag}
            /> }/>
        {/* new note path with the New Note component in it */}
        <Route path="/new" element={<NewNote
          onSubmit={onCreateNote}
          onAddTag={addTag}
          availableTags={tags}/>} />
        {/*  */}
        {/* paths for displaying notes and editing them */}
        <Route path="/:id" element={<NoteLayout notes={notesWithTags}/>} >
          {/* index matches path of route it's nested in */}
          <Route index element={<Note onDelete={onDeleteNote}/>} />
          {/* path to edit notes */}
          <Route path="edit" element={
          <EditNote
            onSubmit={onUpdateNote}
            onAddTag={addTag}
            availableTags={tags} />} />
        </Route>
        {/* This route is used to redirect back to the home page in the event
        someone types anything in the url that doesn't exist. Uses */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  )
}

export default App
