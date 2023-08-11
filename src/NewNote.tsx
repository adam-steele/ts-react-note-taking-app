import { NoteData, Tag } from "./App";
import { NoteForm } from "./NoteForm";

export type NewNoteProps = {
  onSubmit: (data: NoteData) => void
  onAddTag: (tag: Tag) => void
  availableTags: Tag[]
}

export function NewNote( {onSubmit, onAddTag, availableTags} : NewNoteProps) {
  return <>
    <h1 className="mb-4">New Note</h1>
    {/* using a Note form compnent as the form is identical
    for this and editing the note */}
    <NoteForm
      onSubmit={onSubmit}
      onAddTag={onAddTag}
      availableTags={availableTags}
    />
  </>
}
