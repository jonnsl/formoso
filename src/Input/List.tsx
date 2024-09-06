
import React, { ReactNode, RefCallback, useRef } from 'react'
import InputComponent, { Input, duplicateInput } from './Input'
import { replaceAt, remove } from '../Immutable'
import useAutoFocus from '../AutoFocusHook'
import { Draggable, DraggableProvided, DraggableStateSnapshot, Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd'
import classnames from 'classnames'

type InputListProps = {
  listId: string
  inputs: Input[]
  onInputFocus: (index: number) => void
  onChange: (inputs: Input[]) => void
}

export default function InputList (props: InputListProps): ReactNode {
  const { listId, inputs, onInputFocus, onChange } = props

  const listRef = useRef<HTMLDivElement>()
  useAutoFocus(listRef, inputs)

  const renderInput = (input: Input, index: number) => {
    const onInputChange = (value: Input): void => {
      onChange(replaceAt(props.inputs, index, value))
    }

    const onDuplicate = (): void => {
      onChange(props.inputs.concat(duplicateInput(input)))
    }

    const onRemove = (): void => {
      onChange(remove(props.inputs, index))
    }

    return (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
      <InputComponent
        key={input.key}
        innerRef={provided.innerRef}
        draggableProps={provided.draggableProps}
        dragHandleProps={provided.dragHandleProps}
        isDragging={snapshot.isDragging}
        input={input}
        onFocus={() => onInputFocus(index)}
        onChange={onInputChange}
        onDuplicate={onDuplicate}
        onRemove={onRemove} />
    )
  }

  const renderDraggableInput = (input: Input, index: number) => {
    return (
      <Draggable
        key={input.key}
        draggableId={input.key}
        index={index}>{ renderInput(input, index) }</Draggable>
    )
  }

  const renderInputs = (provided: DroppableProvided, snapshot: DroppableStateSnapshot) => {
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
        { inputs.map(renderDraggableInput) }
        { provided.placeholder }
      </div>
    )
  }

  return <Droppable droppableId={listId} type="INPUT">{ renderInputs }</Droppable>
}
