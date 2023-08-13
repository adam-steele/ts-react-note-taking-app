import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import { Note } from "./App"

type NoteLayoutProps = {
  notes: Note[]
}

export function NoteLayout({notes}:NoteLayoutProps) {

  // whatever id is entered search through notes to find that id
  const {id} = useParams()
  const note = notes.find(n=> n.id === id)
  // if can't find note navigate back to homepage and replace url
  if(note == null) return <Navigate to={"/"}  replace />

  return <Outlet context={note} />

}

// helper function u
export function useNote() {
  return useOutletContext<Note>()
}


