
import React from 'react'
import classnames from 'classnames'
import TextareaAutosize from 'react-textarea-autosize'
import InputTypes from './Types'
import { Grip } from '../Icons'
import OverflowMenu, { CheckableMenuItem } from '../OverflowMenu'

export type Input = {
  key: string
  label: string
  type: string
  isConditional: boolean
  condition: string
  required: boolean
  showPre: boolean
  pre: string
  showDescription: boolean
  help: string
  showPos: boolean
  pos: string
  shuffle: boolean
}

type InputProps = {
  input: Input
  onChange: (input: Input) => void
  onDuplicate: () => void
  onRemove: () => void
}

export default function Input (props: InputProps): React.ReactNode {
  const { onChange, onDuplicate, onRemove } = props
  const { label, type, condition, isConditional, required } = props.input
  const { showPre, showDescription, showPos, shuffle, pre, pos, help } = props.input

  return (
    <div tabIndex={0} className="input">
      <div className="grip-row">
        <Grip className="grip" />
      </div>

      { showPre ?
        <TextareaAutosize
          className="seamless"
          rows={1}
          placeholder=""
          onChange={(e) => onChange({ ...props.input, pre: e.target.value })}
          value={pre}/> : null }

      <div className="title-row">
        <div className="title-title">
          <TextareaAutosize
            className="seamless"
            rows={1}
            placeholder="Question"
            value={label}
            onChange={(e) => onChange({ ...props.input, label: e.target.value })} />
        </div>
        <InputTypes
          className="custom-select form-control type-select"
          value={type}
          onChange={(e) => onChange({ ...props.input, type: e.target.value })} />
      </div>

      { showDescription ?
        <TextareaAutosize
          className="seamless"
          rows={2}
          placeholder="Description"
          onChange={(e) => onChange({ ...props.input, help: e.target.value })}
          value={help}/> : null }

      { showPos ?
        <TextareaAutosize
          className="seamless"
          rows={1}
          placeholder=""
          onChange={(e) => onChange({ ...props.input, pos: e.target.value })}
          value={pos}/> : null }

      <div className="bottom-toolbar">
          <div>
            { isConditional ?
              <TextareaAutosize
                spellCheck={false}
                className={classnames('seamless input_condition')}
                rows={1}
                placeholder="Condition"
                onChange={(e) => onChange({ ...props.input, condition: e.target.value })}
                value={condition}/> : null }
          </div>

          <div>
            <button type="button" className="btn btn-link" onClick={onDuplicate} title="Duplicate">
              <i className="bi bi-copy"></i>
            </button>
            <button type="button" className="btn btn-link" onClick={onRemove} title="Remove">
              <i className="bi bi-trash"></i>
            </button>
            <button
              type="button"
              className="btn btn-link"
              onClick={noop}
              title="Validations"
              disabled={(['text', 'textarea', 'number', 'date']).indexOf(type) === -1}>
              <i className="bi bi-asterisk"></i>
            </button>
            <button type="button" className="btn btn-link" onClick={noop} title="Advanced Options">
              <i className="bi bi-gear"></i>
            </button>

            <label className="radio-inline radio-required">
              <input
                type="checkbox"
                value="1"
                checked={required}
                onChange={(e) => onChange({ ...props.input, required: e.target.checked })} />
              { ' Required' }
            </label>

            <OverflowMenu autoClose={false}>
              <CheckableMenuItem
                checked={showPre}
                onClick={() => onChange({ ...props.input, showPre: !showPre })}>
                Before
              </CheckableMenuItem>
              <CheckableMenuItem
                checked={showDescription}
                onClick={() => onChange({ ...props.input, showDescription: !showDescription })}>
                Show description
              </CheckableMenuItem>
              <CheckableMenuItem
                checked={showPos}
                onClick={() => onChange({ ...props.input, showPos: !showPos })}>
                After
              </CheckableMenuItem>
              { (type === 'radio' || type === 'checkbox' || type === 'select' || type === 'multi') ?
                <CheckableMenuItem
                  checked={shuffle}
                  onClick={() => onChange({ ...props.input, shuffle: !shuffle })}>
                  Shuffle option order
                </CheckableMenuItem> : null }
              <CheckableMenuItem
                checked={isConditional}
                onClick={() => onChange({ ...props.input, isConditional: !isConditional })}>
                Conditional
              </CheckableMenuItem>
            </OverflowMenu>
          </div>
        </div>
    </div>
  )
}

let input_key = 0
/**
 * Creates a new empty input
 */
export function emptyInput(): Input {
  return {
    key: `${input_key++}`,
    label: '',
    type: 'text',
    isConditional: false,
    condition: '',
    required: false,
    showPre: false,
    pre: '',
    showDescription: false,
    help: '',
    showPos: false,
    pos: '',
    shuffle: false,
  }
}

/**
 * Duplicates a existing empty input
 */
export function duplicateInput(input: Input): Input {
  return {
    ...input,
    key: `${input_key++}`,
  }
}

function noop() {}
