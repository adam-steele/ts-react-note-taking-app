import { useMemo, useState } from "react";
import { Badge, Button, Card, Col, Form, Modal, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { Tag } from "./App";
import styles  from "./NoteList.module.css";

type NoteListProps = {
  availableTags: Tag[],
  notes: SimplifiedNote[],
  onUpdateTag: (id:string, label:string)=>void
  onDeleteTag: (id:string)=>void
}

type SimplifiedNote = {
  tags: Tag[],
  title: string,
  id: string
}

type EditTagsModalProps= {
  availableTags: Tag[],
  handleClose: ()=> void,
  show: boolean,
  onUpdateTag: (id:string, label:string)=>void,
  onDeleteTag: (id:string )=>void
}

export function NoteList({availableTags, notes, onUpdateTag, onDeleteTag}: NoteListProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [title, setTitle] = useState("")
  const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false)

  const filteredNotes = useMemo(() => {
    return notes.filter(note=> {
      // check to see if title is blank or title includes the exact title.
      // loop thorugh all selectedTags make sure everyone returns true for statment inside.
        // statement inside checks to see if it contains tag in loop to ensure all tags match not just one
      return (title === "" || note.title.toLowerCase().includes(title.toLowerCase()))&&
      (selectedTags.length === 0 || selectedTags.every(tag => note.tags.some(noteTag => noteTag.id === tag.id)))
    })
  }, [title, selectedTags, notes])


  return <>
    <Row className="align-items-center mb-4">
      <Col><h1>Notes</h1></Col>
      <Col xs="auto">
        <Stack direction="horizontal" gap={2}>
          <Link to="/new">
            <Button type="button" variant="primary">Create</Button>
          </Link>
          <Link to="..">
            <Button
              onClick={()=> setEditTagsModalIsOpen(true)}
              type="button"
              variant="outline-secondary"
            >
                Edit Tags
            </Button>
          </Link>
        </Stack>
      </Col>
    </Row>
    <Form>
      {/* the stack component to automatically space out components
       in a vertical stack gap say what space between elements */}
      <Stack gap={4}>
        {/* first row has the title and tags of the note */}
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" value={title}
              onChange={e => setTitle(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="body">
              <Form.Label>Tags</Form.Label>
              {/* this libary used to allow creation of new tags and much better
              multiselect than standard bootstrap allows */}
              <ReactSelect
              // pass an array that has keys for label and for value
                value={selectedTags.map(tag=>{
                // reason declaring this is what creatable react select expects a label and an id
                return {label: tag.label, value: tag.id}
                })}
                options={availableTags.map(tag => {
                  return {label: tag.label, value: tag.id }
                })}
                // need to map values from tag to then modify the values
                onChange={tags => {
                  // converting from label and value as in value above to label and id
                  // doing this to ensure convert from waht creatablereact select expects
                  // to type we actually want to store
                  setSelectedTags(tags.map(tag => {
                    return {label: tag.label, id: tag.value}
                  }))
                }}
                isMulti={true}
                />
            </Form.Group>
          </Col>
        </Row>
      </Stack>
    </Form>
    <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
        {filteredNotes.map( note =>(
          <Col key={note.id}>
            <NoteCard id={note.id} title={note.title} tags={note.tags}/>
          </Col>
        ))}
    </Row>
    <EditTagsModal
      onDeleteTag={onDeleteTag}
      onUpdateTag={onUpdateTag}
      show={editTagsModalIsOpen}
      handleClose={() => setEditTagsModalIsOpen(false)}
      availableTags={availableTags}/>
  </>
}

function NoteCard({id,title,tags}: SimplifiedNote) {
  return <Card as={Link}
    to={`/${id}`}
    className={`h-100 text-reset text-decoration-none ${styles.card}`}>
    <Card.Body>
      <Stack gap={2} className="align-items-center justify-content-center h-100">
        <span className="fs5">{title}</span>
        {tags.length > 0 && (
          <Stack gap={1} direction="horizontal" className="justify-content-center flex-wrap">
            {tags.map(tag=>(
              <Badge className="text-truncate" key={tag.id}>{tag.label}</Badge>
            ))}
          </Stack>
        )}
      </Stack>
    </Card.Body>
  </Card>
}

function EditTagsModal(
  { availableTags,
    handleClose,
    show,
    onDeleteTag,
    onUpdateTag
    }:EditTagsModalProps) {
  return (
  <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Edit Tags</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Stack gap={2}>
          {availableTags.map(tag=> (
            <Row key={tag.id}>
              <Col>
                <Form.Control
                  type="text"
                  value={tag.label}
                  onChange={ e => onUpdateTag(tag.id, e.target.value)}
                />
              </Col>
              <Col xs="auto">
                <Button onClick={ ()=> onDeleteTag(tag.id)} variant="outline-danger">&times;</Button>
              </Col>
            </Row>
          ))}
        </Stack>
      </Form>
    </Modal.Body>
  </Modal>
  )
}
