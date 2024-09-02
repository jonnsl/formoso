
import React, { ElementRef, ReactNode, useEffect, useRef, useState } from 'react'
import FormPage, { Page } from './Page'
import { replaceAt } from './Immutable'

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
  // const [activeSection, setActiveSection] = useState<???>(null)

  const handleScroll = (): void => {
    if (sectionRef && sideBarRef.current && sideBarContainerRef.current) {
      setSideBarPosition(calculateSidebarPosition(sectionRef, sideBarRef.current, sideBarContainerRef.current))
    }
  }

  const handleActiveSectionChange = (el: HTMLElement/*, activeSection: ???*/): void => {
    if (el && sideBarRef.current && sideBarContainerRef.current) {
      setSideBarPosition(calculateSidebarPosition(el, sideBarRef.current, sideBarContainerRef.current))
      setSectionRef(el)
    }
    //activeSection = activeSection
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
    return (
      <FormPage
        key={page.key}
        page={page}
        onSectionFocus={handleActiveSectionChange}
        onChange={onPageChange} />
    )
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
          <button type="button" className="btn btn-link" onMouseDown={noop} title="New Question">
            <span className="bi bi-plus-circle-fill" aria-hidden="true"></span>
          </button>

          <button type="button" className="btn btn-link" onMouseDown={noop} title="New Section">
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
