
import React, { ElementRef, MouseEvent, ReactNode, useEffect, useRef, useState } from 'react'
import FormPage, { emptyPage, Page } from './Page'
import { remove, replaceAt, splice } from './Immutable'
import { emptySection, Section } from './Section'
import { emptyInput } from './Input/Input'

export type FormosoProps = {
  pages: Page[]
  onChange: (pages: Page[]) => void
}

export default function Formoso(props: FormosoProps): ReactNode {
  const { pages, onChange } = props
  const [sideBarPosition, setSideBarPosition] = useState<number>(22)
  const sideBarContainerRef = useRef<ElementRef<"div">>(null)
  const sideBarRef = useRef<ElementRef<"div">>(null)
  // Keeps track of the currently active/focused section
  const [sectionRef, setSectionRef] = useState<HTMLElement | null>(null)
  const [activePage, setActivePage] = useState<number>(0)
  const [activeSection, setActiveSection] = useState<number>(0)

  const handleScroll = (): void => {
    if (sectionRef && sideBarRef.current && sideBarContainerRef.current) {
      setSideBarPosition(calculateSidebarPosition(sectionRef, sideBarRef.current, sideBarContainerRef.current))
    }
  }

  const handleActiveSectionChange = (el: HTMLElement, activeSectionIndex: number, activePageIndex: number): void => {
    if (el && sideBarRef.current && sideBarContainerRef.current) {
      setSideBarPosition(calculateSidebarPosition(el, sideBarRef.current, sideBarContainerRef.current))
      setSectionRef(el)
    }
    setActiveSection(activeSectionIndex)
    setActivePage(activePageIndex)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  const renderPage = (page: Page, index: number): ReactNode => {
    const onPageChange = (page: Page): void => {
      onChange(replaceAt(pages, index, page))
    }
    const removePage = () => {
      onChange(remove(pages, index))
    }

    const addNewPage = () => {
      const newPages = splice(pages, index + 1, 0, emptyPage())
      onChange(newPages)
    }

    const onSectionFocus = (el: HTMLElement, activeSectionIndex: number) => {
      handleActiveSectionChange(el, activeSectionIndex, index)
    }

    // const isFirstPage = index === 0
    const isLastRemainingPage = pages.length === 1

    return (
      <div className="form-page-container" key={page.key}>
      { !isLastRemainingPage ?
        <div className="form-page-topmenu">
          <span>Page { index + 1 }</span>
          <button
            type="button"
            className="btn btn-light btn-sm btn-seamless"
            onClick={removePage}>
              Remove Page
          </button>
        </div> : null }
        <FormPage
          page={page}
          onSectionFocus={onSectionFocus}
          onChange={onPageChange} />
        <div className="form-page-break">
          <button
            type="button"
            className="btn btn-light btn-seamless"
            onClick={addNewPage}>
            + Add New Page
          </button>
        </div>
      </div>
    )
  }

  const onNewSection = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    onChange(addNewSection(pages, activePage, activeSection))
  }

  const onNewQuestion = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    onChange(addNewQuestion(pages, activePage, activeSection))
  }

  return (
    <div className="row">
      <div className="col-md-11">
        { pages.map(renderPage) }
      </div>

      <div className="col-md-1 side_panel_container" ref={sideBarContainerRef}>
        <div
          className="panel panel-default side-panel"
          style={{ transform: `translateY(${sideBarPosition}px)` }}
          ref={sideBarRef}>
          <button type="button" className="btn btn-link" onMouseDown={onNewQuestion} title="New Question">
            <span className="bi bi-plus-circle-fill" aria-hidden="true"></span>
          </button>

          <button type="button" className="btn btn-link" onMouseDown={onNewSection} title="New Section">
            <span className="bi bi-file-earmark-plus-fill" aria-hidden="true"></span>
          </button>

          <button type="button" className="btn btn-link" onClick={noop} title="Preview">
            <span className="bi bi-eye-fill" aria-hidden="true"></span>
          </button>

          <button type="button" className="btn btn-link" onClick={noop} title="Save">
            <span className="bi bi-floppy2-fill" aria-hidden="true"></span>
          </button>

          <button type="button" className="btn btn-link" onClick={noop} title="Import">
            <span className="bi bi-file-arrow-down-fill" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    </div>
  )
}

function noop() {}

function calculateSidebarPosition (section: HTMLElement, sidebar: HTMLElement, sidebarContainer: HTMLElement): number {
  // FIXME: Não funciona quando o sidebarcontainer estiver abaixo dos containers das seções. (i.e. mobile)
  // Se topo da seção estiver acima do viewport, ou seja, scroll após topo da seção.
  if (window.scrollY > (section.offsetTop + sidebarContainer.offsetTop)) {
    // console.log('Se topo da seção estiver acima do viewport, ou seja, scroll após topo da seção.')
    // console.log(window.scrollY, ' > (', section.offsetTop, ' + ', sidebarContainer.offsetTop, ')')
    // console.log(window.scrollY, ' > (', section.offsetTop + sidebarContainer.offsetTop, ')')
    // console.log(window.scrollY, ' - ', sidebarContainer.offsetTop)
    return window.scrollY - sidebarContainer.offsetTop
  }

  // Topo da seção ativa não está visivel no viewport, ou seja, scroll antes do topo da seção.
  if ((window.innerHeight + window.scrollY) < (section.offsetTop + sidebarContainer.offsetTop + sidebar.offsetHeight)) {
    // console.log('Topo da seção ativa não está visivel no viewport, ou seja, scroll antes do topo da seção.')
    // console.log('(',window.innerHeight,' + ',window.scrollY,') < (',section.offsetTop,' + ',sidebarContainer.offsetTop,' + ',sidebar.offsetHeight,')')
    // console.log('(',window.innerHeight + window.scrollY,') < (',section.offsetTop + sidebarContainer.offsetTop + sidebar.offsetHeight,')')
    return (window.innerHeight + window.scrollY - sidebarContainer.offsetTop - sidebar.offsetHeight)
  }

  // Não ultrapassa o final da página.
  // ATENÇÃO: <body> não pode ter height = 100%
  // console.log('Math.min(', section.offsetTop, document.body.offsetHeight - sidebarContainer.offsetTop - sidebarContainer.offsetHeight, ')')
  // return Math.min(section.offsetTop, document.body.offsetHeight - sidebarContainer.offsetTop - sidebarContainer.offsetHeight)

  return section.offsetTop
}

/**
 * Adds a new Section to a given page after a given section
 */
function addNewSection (pages: Page[], pageIndex: number, sectionIndex: number): Page[] {
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
function addNewQuestion (pages: Page[], pageIndex: number, sectionIndex: number): Page[] {
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
    inputs: oldSection.inputs.concat(emptyInput())
  }
  const newPage: Page = {
    ...oldPage,
    sections: replaceAt(oldPage.sections, sectionIndex, newSection)
  }
  return replaceAt(pages, pageIndex, newPage)
}
