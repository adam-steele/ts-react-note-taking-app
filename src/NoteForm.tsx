import { FormEvent, useRef, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CreatableReactSelect from "react-select/creatable";
import { NoteData, Tag } from "./App";
import {v4 as uuidV4} from "uuid";

type NoteFormProps = {
  // pass it Note Date but don't expect anyhting in return
  onSubmit: (data: NoteData) => void
  onAddTag: (tag: Tag) => void
  availableTags: Tag[]
}

export function NoteForm({onSubmit, onAddTag, availableTags}: NoteFormProps) {
  // using refs so whenever input ref gets rendered on the screen
  // the input ref variable will be set to the HTML element it is attached to in the ref attribute.
  const titleRef = useRef<HTMLInputElement>(null)
  const markdownRef = useRef<HTMLTextAreaElement>(null)
  // state for tags
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const navigate = useNavigate()

  function handleSubmit(e:FormEvent) {
    e.preventDefault()
    onSubmit({
      // exclamaiton says whilst it could be null it will never be as these are required fields.
      title: titleRef.current!.value,
      markdown: markdownRef.current!.value,
      tags: selectedTags
    })
    navigate("..")
  }


  return(
    // using bootstrap form component
    <Form onSubmit={handleSubmit}>
      {/* the stack component to automatically space out components
       in a vertical stack gap say what space between elements */}
      <Stack gap={4}>
        {/* first row has the title and tags of the note */}
        <Row>
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control ref={titleRef} required/>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="body">
              <Form.Label>Tags</Form.Label>
              {/* this libary used to allow creation of new tags and much better
              multiselect than standard bootstrap allows */}
              <CreatableReactSelect
                onCreateOption={label => {
                  const newTag = {id: uuidV4(), label}
                  // on add tag allows us to store in localstorage to persist it.
                  onAddTag(newTag)
                  // take all exiting tags add new tag onto the end of array
                  setSelectedTags(prev => [...prev, newTag])
                }}
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
         <Row className="mb-4">
          <Form.Group controlId="markdown">
            <Form.Label>Body</Form.Label>
            {/* 15 rows for styling */}
             <Form.Control ref={markdownRef} required as="textarea" rows={15}/>
          </Form.Group>
         </Row>
      </Stack>
      {/* horizontal stack of elements for the buttons */}
      <Stack direction="horizontal" gap={2}>
        <Button type="submit" variant="primary">Save</Button>
        {/* the cancel button is very simple
        just takes you back to last page you were on */}
        <Link to="..">
          <Button type="button" variant="outline-secondary">Cancel</Button>
        </Link>
      </Stack>
    </Form>
  )
}
