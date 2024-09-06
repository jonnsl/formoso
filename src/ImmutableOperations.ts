
import { Page } from './Page'
import { Section, emptySection } from './Section'
import { emptyInput } from './Input/Input'
import { replaceAt, remove, splice } from './Immutable'

/**
 * Adds a new Section to a given page after a given section
 */
export function addNewSection (pages: Page[], pageIndex: number, sectionIndex: number): Page[] {
  const oldPage = pages[pageIndex]
  if (oldPage === undefined) {
    return pages
  }
  const newPage = {
    ...oldPage,
    sections: splice(oldPage.sections, sectionIndex + 1, 0, emptySection())
  }
  return replaceAt(pages, pageIndex, newPage)
}

/**
 * Adds a new Question to a given section on a given page
 */
export function addNewQuestion (pages: Page[], pageIndex: number, sectionIndex: number, inputIndex: number): Page[] {
  const oldPage = pages[pageIndex]
  if (oldPage === undefined) {
    return pages
  }
  const oldSection = oldPage.sections[sectionIndex]
  if (oldSection === undefined) {
    return pages
  }

  const newSection: Section = {
    ...oldSection,
    inputs: splice(oldSection.inputs, inputIndex + 1, 0, emptyInput()),
  }
  const newPage: Page = {
    ...oldPage,
    sections: replaceAt(oldPage.sections, sectionIndex, newSection)
  }
  return replaceAt(pages, pageIndex, newPage)
}

/**
 * Removes a section from inside a page and inserts inside another page.
 */
export function pickAndPlaceSectionByKeys (pages: Page[], pageSourceKey: string, pageDestKey: string, sectionSourceIdx: number, sectionDestIdx: number): Page[] {
  const pageSourceIdx = findPage(pages, pageSourceKey)
  const pageDestIdx = findPage(pages, pageDestKey)
  return pickAndPlaceSection(pages, pageSourceIdx, pageDestIdx, sectionSourceIdx, sectionDestIdx)
}

/**
 * Removes a section from inside a page and inserts inside another page.
 */
function pickAndPlaceSection (pages: Page[], pageSourceIdx: number, pageDestIdx: number, sectionSourceIdx: number, sectionDestIdx: number): Page[] {
  const pick = pages[pageSourceIdx]?.sections[sectionSourceIdx]
  if (pick === undefined) {
    throw new Error('Source input not found!')
  }
  const oldSourcePage = pages[pageSourceIdx]
  if (oldSourcePage === undefined) {
    throw new Error('Source page not found!')
  }

  if (pageSourceIdx === pageDestIdx) {
    const sectionsWithoutMovedSection = remove(oldSourcePage.sections, sectionSourceIdx)
    const newPage: Page = {
      ...oldSourcePage,
      sections: splice(sectionsWithoutMovedSection, sectionDestIdx, 0, pick),
    }

    return replaceAt(pages, pageSourceIdx, newPage)
  }

  const newSourcePage: Page = {
    ...oldSourcePage,
    sections: remove(oldSourcePage.sections, sectionSourceIdx),
  }

  const oldDestPage = pages[pageDestIdx]
  if (oldDestPage === undefined) {
    throw new Error('Dest page not found!')
  }
  const newDestPage: Page = {
    ...oldDestPage,
    sections: splice(oldDestPage.sections, sectionDestIdx, 0, pick),
  }

  // If the source page ends up with 0 sections, remove it altogether.
  if (newSourcePage.sections.length === 0) {
    return remove(replaceAt(pages, pageDestIdx, newDestPage), pageSourceIdx)
  }

  return pages.map(function (page: Page, index: number): Page {
    if (index === pageSourceIdx) {
      return newSourcePage
    } else if (index === pageDestIdx) {
      return newDestPage
    } else {
      return page
    }
  })
}

/**
 * Removes a input from a section inside a page and inserts inside another section inside another page.
 */
export function pickAndPlaceInputByKeys (pages: Page[], sectionSourceKey: string, sectionDestKey: string, inputSourceIdx: number, inputDestIdx: number): Page[] {
  const [pageSourceIdx, sectionSourceIdx] = findPageAndSection(pages, sectionSourceKey)
  const [pageDestIdx, sectionDestIdx] = findPageAndSection(pages, sectionDestKey)
  return pickAndPlaceInput(pages, pageSourceIdx, pageDestIdx, sectionSourceIdx, sectionDestIdx, inputSourceIdx, inputDestIdx)
}

/**
 * Removes a input from a section inside a page and inserts inside another section inside another page.
 */
function pickAndPlaceInput (pages: Page[], pageSourceIdx: number, pageDestIdx: number, sectionSourceIdx: number, sectionDestIdx: number, inputSourceIdx: number, inputDestIdx: number): Page[] {
  const pick = pages[pageSourceIdx]?.sections[sectionSourceIdx]?.inputs[inputSourceIdx]
  if (pick === undefined) {
    throw new Error('Source input not found!')
  }
  const oldSourcePage = pages[pageSourceIdx]
  if (oldSourcePage === undefined) {
    throw new Error('Source page not found!')
  }
  const oldSourceSection = oldSourcePage.sections[sectionSourceIdx]
  if (oldSourceSection === undefined) {
    throw new Error('Source section not found!')
  }

  if (pageSourceIdx === pageDestIdx) {
    // Drag and drop inside the same page and the same section
    if (sectionSourceIdx === sectionDestIdx) {
      const inputsWithoutMovedInput = remove(oldSourceSection.inputs, inputSourceIdx)
      const newSection: Section = {
        ...oldSourceSection,
        inputs: splice(inputsWithoutMovedInput, inputDestIdx, 0, pick),
      }
      const newPage: Page = {
        ...oldSourcePage,
        sections: replaceAt(oldSourcePage.sections, sectionDestIdx, newSection),
      }
      return replaceAt(pages, pageSourceIdx, newPage)
    }

    // Drag and drop inside the same page and different sections
    const newSourceSection: Section = {
      ...oldSourceSection,
      inputs: remove(oldSourceSection.inputs, inputSourceIdx),
    }

    const oldDestSection = pages[pageDestIdx]?.sections[sectionDestIdx]
    if (oldDestSection === undefined) {
      throw new Error('Destination section not found!')
    }
    const newDestSection: Section = {
      ...oldDestSection,
      inputs: splice(oldDestSection.inputs, inputDestIdx, 0, pick),
    }

    const sections = oldSourcePage.sections.map(function (section: Section, index: number): Section {
      if (index === sectionSourceIdx) {
        return newSourceSection
      } else if (index === sectionDestIdx) {
        return newDestSection
      } else {
        return section
      }
    })
    const newPage: Page = {
      ...oldSourcePage,
      sections,
    }
    return replaceAt(pages, pageSourceIdx, newPage)
  }

  // Drag and drop between different pages. This implies different sections also.
  const newSourceSection: Section = {
    ...oldSourceSection,
    inputs: remove(oldSourceSection.inputs, inputSourceIdx),
  }

  const oldDestSection = pages[pageDestIdx]?.sections[sectionDestIdx]
  if (oldDestSection === undefined) {
    throw new Error('Destination section not found!')
  }
  const newDestSection: Section = {
    ...oldDestSection,
    inputs: splice(oldDestSection.inputs, inputDestIdx, 0, pick),
  }

  const newSourcePage: Page = {
    ...oldSourcePage,
    sections: replaceAt(oldSourcePage.sections, sectionSourceIdx, newSourceSection),
  }

  const oldDestPage = pages[pageDestIdx]
  if (oldDestPage === undefined) {
    throw new Error('Destination page not found!')
  }
  const newDestPage: Page = {
    ...oldDestPage,
    sections: replaceAt(oldDestPage.sections, sectionDestIdx, newDestSection),
  }

  return pages.map(function (page: Page, index: number): Page {
    if (index === pageSourceIdx) {
      return newSourcePage
    } else if (index === pageDestIdx) {
      return newDestPage
    } else {
      return page
    }
  })
}

/**
 * Given a section key, finds the index of the page and the index of the section
 */
function findPageAndSection (pages: Page[], sectionKey: string): [number, number] {
  for (let i = 0, l = pages.length; i < l; i++) {
    const page = pages[i]
    if (page === undefined) {
      throw new Error('')
    }
    const sections = page.sections
    for (let j = 0, n = sections.length; j < n; j++) {
      const section = sections[j]
      if (section === undefined) {
        throw new Error('')
      }
      if (section.key === sectionKey) {
        return [i, j]
      }
    }
  }

  throw new Error('Section not found!')
}

/**
 * Finds the index of the page given a page key.
 */
function findPage (pages: Page[], pageKey: string): number {
  for (let i = 0, l = pages.length; i < l; i++) {
    const page = pages[i]
    if (page === undefined) {
      throw new Error('')
    }
    if (page.key === pageKey) {
      return i
    }
  }

  throw new Error('Page not found!')
}
