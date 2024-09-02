
import React, { ReactNode } from 'react'
import FormSection, { Section, emptySection, duplicateSection, mergeSections } from './Section'
import { remove, replaceAt, splice } from './Immutable'

export type Page = {
  key: string
  sections: Section[]
}

export type FormPageProps = {
  page: Page
  onSectionFocus: (el: HTMLElement) => void
  onChange: (value: Page) => void
}

export default function FormPage(props: FormPageProps): ReactNode {
  const { page, onChange, onSectionFocus } = props

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

    const length = props.page.sections.length

    return (
      <FormSection
        key={section.key}
        title={`Section ${index + 1} of ${length}`}
        section={section}
        onFocus={onSectionFocus}
        onDuplicate={onDuplicate}
        onRemove={length > 1 ? onRemove : null}
        onMerge={index > 0 ? onMerge : null}
        onChange={onSectionChange} />
    )
  }

  return page.sections.map(renderSection)
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

function noop (): void {}
