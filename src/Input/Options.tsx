
import React, { KeyboardEvent, MouseEvent, ClipboardEvent, RefCallback, useEffect, useRef } from 'react'
import classnames from 'classnames'
import { reorder, replaceAt, remove, splice } from '../Immutable'
import { DragDropContext, Droppable, Draggable, DropResult, DroppableStateSnapshot, DroppableProvided, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd'
import { Grip } from '../Icons'
import { limitMovementToYAxis } from '../DragAndDropUtils'
import { pasteToList } from './utils'
import { v4 as uuidv4 } from 'uuid'

export type OptionItem = {
  key: string
  label: string
}

type OptionsProps = {
  value: OptionItem[]
  onChange: (value: OptionItem[]) => void
  defaultLabel?: string
  type: string
  addNewLabel?: string
}

export default function Options (props: OptionsProps) {
  const { value: options, type, onChange } = props
  const {
    defaultLabel = 'Option %d',
    addNewLabel = 'Add New Option',
  } = props

  const previousRef = useRef<OptionItem[]>()
  const optionsRef = useRef<HTMLDivElement>()

  const focusOption = (index: number) => {
    if (optionsRef.current) {
      const inputElement = optionsRef.current.childNodes[index]
      if (inputElement && inputElement instanceof Element) {
        const labelInput = inputElement.querySelector('input[type=text]')
        if (labelInput && labelInput instanceof HTMLElement) {
          labelInput.focus()
        }
      }
    }
  }

  const selectAllOption = (index: number) => {
    if (optionsRef.current) {
      const inputElement = optionsRef.current.childNodes[index]
      if (inputElement && inputElement instanceof Element) {
        const labelInput = inputElement.querySelector('input[type=text]')
        if (labelInput && labelInput instanceof HTMLInputElement) {
          selectAll(labelInput)
        }
      }
    }
  }

  useEffect(() => {
    if (previousRef.current) {
      const prevOptions = previousRef.current

      // Check if a new option was added at the end
      if (prevOptions.length < options.length) {
        // Focus last option
        const lastOptionIndex = options.length - 1
        focusOption(lastOptionIndex)
        const lastOption = options[lastOptionIndex]
        if (lastOption && lastOption.label !== '') {
          selectAllOption(lastOptionIndex)
        }
      }

      // Check if a new option was removed
      if (prevOptions.length > options.length) {
        for (let i = 0, l = prevOptions.length; i < l; i++) {
          if (options[i] !== prevOptions[i]) {
            focusOption(i === 0 ? 0 : i - 1)
            break
          }
        }
      }
    }

    return () => {
      previousRef.current = options
    }
  })

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    const items = reorder(options, result.source.index, result.destination.index)
    onChange(items)
  }

  const addNewOption = (label: string | null = null) => {
    if (label === null) {
      label = defaultLabel.replace('%d', `${options.length + 1}`)
    }
    const newOption = emptyOption(label)
    onChange(options.concat(newOption))
  }

  const handleLinePaste = (i: number) => (e: ClipboardEvent<HTMLInputElement>): void => {
    // Only alter the default behaviour if the input has everything selected.
    if (e.currentTarget.selectionStart !== 0 || e.currentTarget.selectionEnd !== e.currentTarget.value.length) {
      return
    }

    e.preventDefault()

    const lines = pasteToList(e)
    if (lines === null) {
      return
    }

    const firstLine = lines.shift()
    const activeOption = options[i]
    if (firstLine === undefined || activeOption === undefined) {
      return
    }

    const newOptions = splice(options, i, 1, { ...activeOption, label: firstLine })
    onChange(newOptions.concat(lines.map((line: string) => emptyOption(line))))
  }

  const handleOptionChange = (i: number) => (option: OptionItem) => {
    onChange(replaceAt(options, i, option))
  }

  const removeOption = (i: number) => (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    onChange(remove(options, i))
  }

  const renderOptions = (provided: DroppableProvided, _snapshot: DroppableStateSnapshot) => {
    const legacyRef: RefCallback<HTMLDivElement> = (element: HTMLDivElement | null): void => {
      if (element) {
        optionsRef.current = element
      }
      provided.innerRef(element)
    }

    return (
      <div ref={legacyRef} {...provided.droppableProps} className="options">
        { renderRows() }
        { provided.placeholder }
      </div>
    )
  }

  const renderRows = () => {
    const rows = options.map((option, index) => {
      return (
        <Draggable
          key={option.key}
          draggableId={option.key}
          isDragDisabled={false}
          index={index}>
          { renderRow(option, index) }
        </Draggable>
      )
    })

    return rows
  }

  const renderRow = (option: OptionItem, index: number) => {
    const length = options.length
    const undeletable = length === 1

    return (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
      <Option
        innerRef={provided.innerRef}
        draggableProps={provided.draggableProps}
        dragHandleProps={provided.dragHandleProps}
        i={index + 1}
        type={type}
        undeletable={undeletable}
        value={option}
        isDragging={snapshot.isDragging}
        onPaste={handleLinePaste(index)}
        onChange={handleOptionChange(index)}
        onRemove={removeOption(index)} />
    )
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="options" type="OPTION" isDropDisabled={false}>{ renderOptions }</Droppable>
      </DragDropContext>
      <div className="options add_new_option">
        <AddOption
          i={options.length + 1 }
          type={type}
          placeholder={addNewLabel}
          addNewOption={addNewOption} />
      </div>
    </>
  )
}

type OptionProps = {
  innerRef: DraggableProvided['innerRef']
  draggableProps: DraggableProvided['draggableProps']
  dragHandleProps: DraggableProvided['dragHandleProps']
  isDragging: boolean
  draggable?: boolean
  i: number
  onChange: (value: OptionItem) => void
  onRemove?: ((e: MouseEvent<HTMLButtonElement>) => void) | undefined
  onPaste?: ((e: ClipboardEvent<HTMLInputElement>) => void) | undefined
  placeholder?: string
  type: string
  undeletable: boolean
  value: OptionItem
}

function Option (props: OptionProps) {
  const {
    placeholder = '',
    value = emptyOption(),
    draggable = true
  } = props

  const { innerRef, draggableProps, dragHandleProps, isDragging } = props
  const { onRemove, onChange, onPaste, undeletable, type, i } = props
  const { label } = value

  return (
    <div className={classnames('option', { draggable, dragging: isDragging })} ref={innerRef} {...limitMovementToYAxis(draggableProps)}>
      <Grip className="grip" {...dragHandleProps} />
      { (type === 'radio' || type === 'checkbox') ? <input type={type} className="custom-control-input" checked={false} readOnly tabIndex={-1} /> : <span>{`${i}. `}</span> }
      <input
        type="text"
        className="seamless"
        value={label}
        placeholder={placeholder}
        onPaste={onPaste}
        onFocus={(e) => selectAll(e.target)}
        onChange={(e) => onChange({ ...value, label: e.target.value })} />
      <button type="button" className="btn btn-link" onClick={onRemove} title="Remove" disabled={undeletable}>
        <span className="bi bi-x" aria-hidden="true"></span>
      </button>
    </div>
  )
}

const navigationKeys = [
  'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'End', 'Home', 'PageDown',
  'PageUp',
]
const predefinedKeys = [
  'Backspace', 'Clear', 'Copy', 'CrSel', 'Cut', 'Delete', 'EraseEof', 'ExSel',
  'Insert', 'Paste', 'Redo', 'Undo', 'Tab', 'Shift',
]

type AddOptionProps = {
  i: number
  addNewOption: (label?: string | null) => void
  type: string
  placeholder: string
}

function AddOption (props: AddOptionProps) {
  const { addNewOption, type, i, placeholder } = props

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (navigationKeys.indexOf(e.key) === -1 && predefinedKeys.indexOf(e.key) === -1) {
      addNewOption('')
    }
  }

  return (
    <div className="option">
      <Grip className="grip"/>
      { (type === 'radio' || type === 'checkbox') ? <input type={type} className="custom-control-input" checked={false} readOnly tabIndex={-1} /> : <span>{`${i}. `}</span> }
      <input
        type="text"
        className="seamless"
        value=""
        placeholder={placeholder}
        onChange={noop}
        onMouseUp={() => addNewOption()}
        onKeyDown={handleKeyDown} />
    </div>
  )
}

function selectAll (el: HTMLInputElement) {
  el.setSelectionRange(0, el.value.length)
}

function noop () {}

/**
 * Creates a new empty option
 */
export function emptyOption (option: string = ''): OptionItem {
  return {
    key: uuidv4(),
    label: option,
  }
}
