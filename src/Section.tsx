
import React, { ReactNode, RefCallback, useRef } from 'react'
import classnames from 'classnames'
import TextareaAutosize from 'react-textarea-autosize'
import InputList from './Input/List'
import { emptyInput, Input } from './Input/Input'
import OverflowMenu, { MenuItem } from './OverflowMenu'
import { Grip, Triangle } from './Icons'
import { DraggableProvided } from 'react-beautiful-dnd'
import { v4 as uuidv4 } from 'uuid'

export interface Section {
  key: string
  title: string
  inputs: Input[]
}

export type SectionProps = {
  innerRef: DraggableProvided['innerRef']
  draggableProps: DraggableProvided['draggableProps']
  dragHandleProps: DraggableProvided['dragHandleProps']
  isDragging: boolean
  title: string,
  section: Section,
  onFocus: (el: HTMLElement) => void
  onInputFocus: (index: number) => void
  onChange: (value: Section) => void
  onDuplicate: () => void
  onRemove: (() => void) | null
  onMerge: (() => void) | null
}

export default function Section(props: SectionProps): ReactNode {
  const { innerRef, draggableProps, dragHandleProps, isDragging } = props
  const { section, onFocus, onChange, onDuplicate, onRemove, onMerge, onInputFocus } = props
  const divRef = useRef<HTMLDivElement>()

  const legacyRef: RefCallback<HTMLDivElement> = (element: HTMLDivElement | null): void => {
    if (element) {
      divRef.current = element
    }
    innerRef(element)
  }

  return (
    <div
      className={classnames('panel panel-default section', { dragging: isDragging })}
      ref={legacyRef}
      onFocus={() => divRef.current ? onFocus(divRef.current) : null}
      {...draggableProps}>
      <div className="section-top-bar">
        <div className="section-info">
          <Grip className="grip" {...dragHandleProps} />
          <span>{ props.title }</span>
          <Triangle className="top-triangle" />
        </div>
        <div className="section-overflow-menu">
          <OverflowMenu>
            <MenuItem onClick={onDuplicate}>Duplicate</MenuItem>
            { onRemove ? <MenuItem onClick={onRemove}>Delete</MenuItem> : null }
            { onMerge ? <MenuItem onClick={onMerge}>Merge with section above</MenuItem> : null }
          </OverflowMenu>
        </div>
      </div>
      <div className="panel-heading">
        <TextareaAutosize
          rows={1}
          className="section-title-input"
          placeholder="Section Title"
          value={section.title}
          onChange={(e) => onChange({ ...section, title: e.target.value })} />
      </div>
      <div className="panel-body">
        <InputList
          inputs={section.inputs}
          listId={section.key}
          onInputFocus={onInputFocus}
          onChange={(inputs) => onChange({ ...section, inputs })} />
      </div>
    </div>
  )
}

/**
 * Creates a new empty section
 */
export function emptySection(): Section {
  return {
    key: uuidv4(),
    title: '',
    inputs: [emptyInput()],
  }
}

/**
 * Duplicates an existing section
 */
export function duplicateSection(section: Section): Section {
  return {
    ...section,
    key: uuidv4(),
  }
}

/**
 * Merge two secions together
 */
export function mergeSections(a: Section, b: Section): Section {
  return {
    key: uuidv4(),
    title: a.title,
    inputs: a.inputs.concat(b.inputs),
  }
}
