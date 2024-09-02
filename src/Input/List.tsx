
import React, { ReactNode } from 'react'
import InputComponent, { Input, duplicateInput } from './Input'
import { replaceAt, remove } from '../Immutable'

type InputListProps = {
  inputs: Input[]
  onChange: (inputs: Input[]) => void
}

export default function InputList (props: InputListProps): ReactNode {
  const { onChange } = props

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
        onChange={onInputChange}
        onDuplicate={onDuplicate}
        onRemove={onRemove}/>
    )
  }

  return (
    <div>
      { props.inputs.map(renderInput) }
    </div>
  )
}
