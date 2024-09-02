
import React, { useState, useRef, useEffect, ReactNode, SyntheticEvent, KeyboardEvent as ReactKeyboardEvent } from 'react'
import classnames from 'classnames'

type OverflowMenuProps = {
  autoClose?: boolean
  icon?: string
  children: (IMenuItem | null)[]
}

export default function OverflowMenu ({ autoClose = true, icon = 'three-dots-vertical', children }: OverflowMenuProps): ReactNode {
  const [selected, setSelected] = useState(-1)
  const [isOpen, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const childrenLength = ReactChildrenCount(children)

  const close = (): void => {
    setOpen(false)
    setSelected(-1)
  }

  const open = (): void => {
    setOpen(true)
  }

  // Close the menu on click outside and Escape
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const closeMenuIfTargetIsOutsideMenu = (e: MouseEvent) => {
      if (ref.current && e.target && e.target instanceof Element && !ref.current.contains(e.target)) {
        close()
      }
    }

    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      }
    }

    const closeMenuFocused = (_: FocusEvent) => {
      if (ref.current && !ref.current.contains(document.activeElement)) {
        close()
      }
    }

    window.addEventListener('focus', closeMenuFocused, { capture: true })
    document.body.addEventListener('mousedown', closeMenuIfTargetIsOutsideMenu)
    document.body.addEventListener('keydown', closeOnEscape)
    return () => {
      window.removeEventListener('focus', closeMenuFocused)
      document.body.removeEventListener('mousedown', closeMenuIfTargetIsOutsideMenu)
      document.body.removeEventListener('keydown', closeOnEscape)
      setSelected(-1)
    }
  }, [ref, isOpen])

  // Select the menu items with arrow up and arrow down
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const focusMenuItem = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (selected === childrenLength - 1) {
          setSelected(0)
        } else {
          setSelected(selected + 1)
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (selected === 0 || selected === -1) {
          setSelected(childrenLength - 1)
        } else {
          setSelected(selected - 1)
        }
      } else if (selected !== -1 && (e.key === ' ' || e.key === 'Enter')) {
        if (children[selected] && children[selected].props.onClick) {
          children[selected].props.onClick()
        }
      }
    }

    document.body.addEventListener('keydown', focusMenuItem)
    return () => {
      document.body.removeEventListener('keydown', focusMenuItem)
    }
  }, [isOpen, children, selected])

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>): void => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      open()
    }
  }

  const menuItems = React.Children.map(children, (child, i) => {
    if (!child) {
      // FIXME: this will break the selected class of the items that follow.
      return child
    }
    return <li className={classnames({ selected: selected === i })}>{ child }</li>
  })

  return (
    <div
      ref={ref}
      className={classnames('overflow-menu', 'dropdown', { open: isOpen })}>
      <button
        className="overflow-btn dropdown-toggle"
        onMouseDown={open}
        onClick={preventDefault()}
        onKeyDown={handleKeyDown}
        tabIndex={0}>
        <span className={'bi bi-' + icon} aria-hidden="true"></span>
      </button>
      <ul className={classnames('dropdown-menu', { show: isOpen })} role="menu" onClick={autoClose ? () => close() : undefined}>
        { menuItems }
      </ul>
    </div>
  )
}

type IMenuItem = React.ReactElement<IMenuItemProps>

interface IMenuItemProps {
  onClick?: () => void,
}

type MenuItemProps = {
  children: ReactNode,
  onClick: () => void,
}

export function MenuItem ({ children, onClick }: MenuItemProps) {
  return (
    <a
      href="#"
      tabIndex={-1}
      className="dropdown-item"
      onClick={preventDefault(onClick)}>{ children }</a>
  )
}

type CheckableMenuItemProps = {
  checked: boolean,
  children: ReactNode,
  onClick: () => void,
}

export function CheckableMenuItem ({ checked, onClick, children }: CheckableMenuItemProps) {
  return (
    <a
      href="#"
      tabIndex={-1}
      className={classnames('dropdown-item', 'checkable', { checked })}
      onClick={preventDefault(onClick)}>
      <span className="bi bi-check" aria-hidden="true"></span>
      { children }
    </a>
  )
}

type EventHandler = () => void
function preventDefault (listener: EventHandler = noop) {
  return function (e: SyntheticEvent): void {
    e.preventDefault()
    listener()
  }
}

function ReactChildrenCount (children: ReactNode) {
  return React.Children.toArray(children).filter(identity).length
}

function identity (value: unknown): unknown {
  return value
}

function noop (): void {}
