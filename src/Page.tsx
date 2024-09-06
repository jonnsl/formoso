
import React, { ReactNode, RefCallback, useRef } from 'react'
import classnames from 'classnames'
import FormSection, { Section, emptySection, duplicateSection, mergeSections } from './Section'
import { remove, replaceAt, splice } from './Immutable'
import useAutoFocus from './AutoFocusHook'
import { Draggable, DraggableProvided, DraggableStateSnapshot, Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd'

export type Page = {
  key: string
  sections: Section[]
}

export type FormPageProps = {
  page: Page
  onSectionFocus: (el: HTMLElement, index: number) => void
  onInputFocus: (index: number) => void
  onChange: (value: Page) => void
}

export default function FormPage(props: FormPageProps): ReactNode {
  const { page, onChange, onSectionFocus, onInputFocus } = props
  const { sections } = page

  const listRef = useRef<HTMLDivElement>()
  useAutoFocus(listRef, sections)

  const renderSection = (section: Section, index: number) => {
    const onSectionChange = (section: Section): void => {
      const sections = replaceAt(page.sections, index, section)
      onChange({ ...page, sections })
    }

    const onDuplicate = (): void => {
      const sections = page.sections.concat(duplicateSection(section))
      onChange({ ...page, sections })
    }

    const onRemove = (): void => {
      const sections = remove(page.sections, index)
      onChange({ ...page, sections })
    }

    const onMerge = (): void => {
      const previousSection = page.sections[index - 1]
      if (previousSection === undefined) {
        return
      }

      const mergedSection = mergeSections(previousSection, section)
      const sections = splice(page.sections, index - 1, 2, mergedSection)
      onChange({ ...page, sections })
    }

    const handleSectionFocus = (el: HTMLElement): void => {
      onSectionFocus(el, index)
    }

    const length = props.page.sections.length

    return (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
      <FormSection
        key={section.key}
        innerRef={provided.innerRef}
        draggableProps={provided.draggableProps}
        dragHandleProps={provided.dragHandleProps}
        isDragging={snapshot.isDragging}
        title={`Section ${index + 1} of ${length}`}
        section={section}
        onFocus={handleSectionFocus}
        onInputFocus={onInputFocus}
        onDuplicate={onDuplicate}
        onRemove={length > 1 ? onRemove : null}
        onMerge={index > 0 ? onMerge : null}
        onChange={onSectionChange} />
    )
  }

  const renderDraggableSection = (section: Section, index: number) => {
    return (
      <Draggable
        key={section.key}
        draggableId={section.key}
        index={index}>{ renderSection(section, index) }</Draggable>
    )
  }

  const renderSections = (provided: DroppableProvided, snapshot: DroppableStateSnapshot) => {
    const className = classnames('inputs', {
      'dragging-over': snapshot.isDraggingOver,
    })
    const legacyRef: RefCallback<HTMLDivElement> = (element: HTMLDivElement | null): void => {
      if (element) {
        listRef.current = element
      }
      provided.innerRef(element)
    }

    return (
      <div className={className} ref={legacyRef} {...provided.droppableProps}>
        { sections.map(renderDraggableSection) }
        { provided.placeholder }
      </div>
    )
  }

  return <Droppable droppableId={page.key} type="SECTION">{ renderSections }</Droppable>
}

let page_key = 0
/**
 * Creates a new empty page
 */
export function emptyPage(): Page {
  return {
    key: `PAGE_${page_key++}`,
    sections: [emptySection()],
  }
}
