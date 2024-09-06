
import React, { ReactNode, useRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import InputList from './Input/List'
import { emptyInput, Input } from './Input/Input'
import OverflowMenu, { MenuItem } from './OverflowMenu'
import { Grip, Triangle } from './Icons'

export interface Section {
  key: string
  title: string
  inputs: Input[]
}

export type SectionProps = {
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
  const { section, onFocus, onChange, onDuplicate, onRemove, onMerge, onInputFocus } = props
  const divRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className="panel panel-default section"
      ref={divRef}
      onFocus={() => divRef.current ? onFocus(divRef.current) : null}>
      <div className="section-top-bar">
        <div className="section-info">
          <Grip className="grip" />
          <span>{ props.title }</span>
          <Triangle className="top-triangle" />
        </div>
        <div className="section-overflow-menu">
          <OverflowMenu>
            <MenuItem onClick={onDuplicate}>Duplicar</MenuItem>
            { onRemove ? <MenuItem onClick={onRemove}>Excluir</MenuItem> : null }
            { onMerge ? <MenuItem onClick={onMerge}>Mesclar com a seção acima</MenuItem> : null }
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

let section_key = 0
/**
 * Creates a new empty section
 */
export function emptySection(): Section {
  return {
    key: `${section_key++}`,
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
    key: `${section_key++}`,
  }
}

/**
 * Merge two secions together
 */
export function mergeSections(a: Section, b: Section): Section {
  return {
    key: `${section_key++}`,
    title: a.title,
    inputs: a.inputs.concat(b.inputs),
  }
}
