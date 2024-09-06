
import React, { ElementRef, MouseEvent, ReactNode, useEffect, useRef, useState } from 'react'
import FormPage, { emptyPage, Page } from './Page'
import { remove, replaceAt, splice } from './Immutable'
import { pickAndPlaceSectionByKeys, pickAndPlaceInputByKeys, addNewQuestion, addNewSection } from './ImmutableOperations'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'

export type FormosoProps = {
  pages: Page[]
  onChange: (pages: Page[]) => void
}

export default function Formoso(props: FormosoProps): ReactNode {
  const { pages, onChange } = props

  // Sidebar position
  const [sideBarPosition, setSideBarPosition] = useState<number>(22)
  const sideBarContainerRef = useRef<ElementRef<"div">>(null)
  const sideBarRef = useRef<ElementRef<"div">>(null)

  // Keeps track of the currently active/focused section
  const sectionRef = useRef<HTMLElement | null>(null)
  const activePage = useRef<number>(0)
  const activeSection = useRef<number>(0)
  const activeInput = useRef<number>(0)

  const handleScroll = (): void => {
    if (sectionRef.current && sideBarRef.current && sideBarContainerRef.current) {
      setSideBarPosition(calculateSidebarPosition(sectionRef.current, sideBarRef.current, sideBarContainerRef.current))
    }
  }

  const handleActiveSectionChange = (el: HTMLElement, activeSectionIndex: number, activePageIndex: number): void => {
    if (el && sideBarRef.current && sideBarContainerRef.current) {
      setSideBarPosition(calculateSidebarPosition(el, sideBarRef.current, sideBarContainerRef.current))
      sectionRef.current = el
    }
    activeSection.current = activeSectionIndex
    activePage.current = activePageIndex
  }

  const onInputFocus = (inputIndex: number): void => {
    activeInput.current = inputIndex
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])


  const onDragEnd = (result: DropResult) => {
    if (result.combine) {
      return
    }

    // dropped nowhere
    if (!result.destination) {
      return
    }

    const { source, destination } = result

    // did not move anywhere - can bail early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return
    }

    if (result.type === 'INPUT') {
      const inputSourceIdx = source.index
      const inputDestIdx = destination.index
      onChange(pickAndPlaceInputByKeys(pages, source.droppableId, destination.droppableId, inputSourceIdx, inputDestIdx))
    } else if (result.type === 'SECTION') {
      const sectionSourceIdx = source.index
      const sectionDestIdx = destination.index
      onChange(pickAndPlaceSectionByKeys(pages, source.droppableId, destination.droppableId, sectionSourceIdx, sectionDestIdx))
    }
  }

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
          onInputFocus={onInputFocus}
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
    onChange(addNewSection(pages, activePage.current, activeSection.current))
  }

  const onNewQuestion = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    onChange(addNewQuestion(pages, activePage.current, activeSection.current, activeInput.current))
  }

  return (
    <div className="row">
      <div className="col-md-11">
        <DragDropContext onDragEnd={onDragEnd}>
          { pages.map(renderPage) }
        </DragDropContext>
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
