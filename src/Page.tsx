
import React, { ReactNode, useRef } from 'react'
import FormSection, { Section, emptySection, duplicateSection, mergeSections } from './Section'
import { remove, replaceAt, splice } from './Immutable'
import useAutoFocus from './AutoFocusHook'

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

  const listRef = useRef<HTMLDivElement>(null)
  useAutoFocus(listRef, sections)

  const renderSection = (section: Section, index: number): ReactNode => {
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

    return (
      <FormSection
        key={section.key}
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

  return (
    <div ref={listRef}>
      { page.sections.map(renderSection) }
    </div>
  )
}

let page_key = 0
/**
 * Creates a new empty page
 */
export function emptyPage(): Page {
  return {
    key: `${page_key++}`,
    sections: [emptySection()],
  }
}
