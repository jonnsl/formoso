
import React, { ReactNode, useEffect, useRef } from 'react'
import InputComponent, { Input, duplicateInput } from './Input'
import { replaceAt, remove } from '../Immutable'

type InputListProps = {
  inputs: Input[]
  onInputFocus: (index: number) => void
  onChange: (inputs: Input[]) => void
}

export default function InputList (props: InputListProps): ReactNode {
  const { inputs, onInputFocus, onChange } = props

  const previousRef = useRef<Input[]>()
  const listRef = useRef<HTMLDivElement>(null)

  const focusInput = (index: number) => {
    if (listRef.current) {
      const inputElement = listRef.current.childNodes[index]
      if (inputElement && inputElement instanceof HTMLElement) {
        inputElement.querySelector('textarea')?.focus()
      }
    }
  }

  useEffect(() => {
    if (previousRef.current) {
      const prevInputs = previousRef.current

      // Check if a new input was added
      if (prevInputs.length < inputs.length) {
        for (let i = 0, l = inputs.length; i < l; i++) {
          if (prevInputs[i] !== inputs[i]) {
            focusInput(i)
            break
          }
        }
      }

      // Check if a input was removed
      else if (prevInputs.length > inputs.length) {
        for (let i = 0, l = prevInputs.length; i < l; i++) {
          if (prevInputs[i] !== inputs[i]) {
            focusInput(i === 0 ? 0 : i - 1)
            break
          }
        }
      }
    }

    return () => {
      previousRef.current = inputs
    }
  })

  const renderInput = (input: Input, index: number): ReactNode => {
    const onInputChange = (value: Input): void => {
      onChange(replaceAt(props.inputs, index, value))
    }

    const onDuplicate = (): void => {
      onChange(props.inputs.concat(duplicateInput(input)))
    }

    const onRemove = (): void => {
      onChange(remove(props.inputs, index))
    }

    return (
      <InputComponent
        key={input.key}
        input={input}
        onFocus={() => onInputFocus(index)}
        onChange={onInputChange}
        onDuplicate={onDuplicate}
        onRemove={onRemove} />
    )
  }

  return (
    <div ref={listRef}>
      { props.inputs.map(renderInput) }
    </div>
  )
}
