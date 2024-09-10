
import React, { useState } from 'react'
import Modal from 'react-modal'
import classnames from 'classnames'
import TextareaAutosize from 'react-textarea-autosize'
import InputTypes from './Types'
import { Grip } from '../Icons'
import OverflowMenu, { CheckableMenuItem } from '../OverflowMenu'
import Options, { emptyOption, OptionItem } from './Options'
import FileInput from './FileInput'
import Multi from './Multi'
import RatingInput, { Rating, defaultRating } from './Rating'
import ValidationRulesForm, { ValidationRules } from './ValidationRules'
import AdvancedOptionsForm, { AdvancedOptions } from './AdvancedOptions'
import { DraggableProvided } from 'react-beautiful-dnd'
import { v4 as uuidv4 } from 'uuid'

export type Column = OptionItem
export type Row = OptionItem

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
  options: OptionItem[]
  size: number
  maxsize: string
  acceptAll: boolean
  accept: string[]
  rows: Row[]
  columns: Column[]
  rating: Rating
  validation: ValidationRules
  advanced: AdvancedOptions
}

type InputProps = {
  innerRef: DraggableProvided['innerRef']
  draggableProps: DraggableProvided['draggableProps']
  dragHandleProps: DraggableProvided['dragHandleProps']
  isDragging: boolean
  input: Input
  onChange: (input: Input) => void
  onFocus: () => void
  onDuplicate: () => void
  onRemove: () => void
}

export default function Input (props: InputProps): React.ReactNode {
  const [validationOptionsModalOpen, setValidationOptionsModalOpen] = useState(false)
  const [advancedOptionsModalOpen, setAdvancedOptionsModalOpen] = useState(false)
  const { innerRef, draggableProps, dragHandleProps, isDragging } = props
  const { onChange, onDuplicate, onRemove, onFocus } = props
  const { label, type, condition, isConditional, required } = props.input
  const { showPre, showDescription, showPos, shuffle, pre, pos, help } = props.input

  const closeValidationOptionsModal = () => setValidationOptionsModalOpen(false)
  const closeAdvancedOptionsModal = () => setAdvancedOptionsModalOpen(false)

  return (
    <div tabIndex={0} className={classnames('input', `input_${type}`, { dragging: isDragging })} onFocus={onFocus} ref={innerRef} {...draggableProps}>
      <div className="grip-row">
        <Grip className="grip" {...dragHandleProps} />
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

      <DummyInput value={props.input} onChange={onChange} />

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
              onClick={() => setValidationOptionsModalOpen(true)}
              title="Validations"
              disabled={(['text', 'textarea', 'number', 'date']).indexOf(type) === -1}>
              <i className="bi bi-asterisk"></i>
            </button>
            <button type="button" className="btn btn-link" onClick={() => setAdvancedOptionsModalOpen(true)} title="Advanced Options">
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

        <Modal
          isOpen={validationOptionsModalOpen}
          contentElement={renderModalContent}
          contentLabel="Validation Rules">
            <div className="modal-header">
              <h4 className="modal-title">Validation Rules</h4>
              <button onClick={closeValidationOptionsModal} type="button" className="btn-close" aria-label="Close"></button>
            </div>
            <div className="modal-body form-horizontal">
              <ValidationRulesForm type={type} value={props.input.validation} onChange={(validation) => onChange({ ...props.input, validation})} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={closeValidationOptionsModal}>Ok</button>
            </div>
        </Modal>

        <Modal
          isOpen={advancedOptionsModalOpen}
          contentElement={renderModalContent}
          contentLabel="Advanced Options">
          <div className="modal-header">
            <h4 className="modal-title">Advanced Options</h4>
            <button onClick={closeAdvancedOptionsModal} type="button" className="btn-close" aria-label="Close"></button>
          </div>
          <div className="modal-body form-horizontal">
            <AdvancedOptionsForm type={type} value={props.input.advanced} onChange={(advanced) => onChange({ ...props.input, advanced})} />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default" onClick={closeAdvancedOptionsModal}>Ok</button>
          </div>
        </Modal>
    </div>
  )
}

function renderModalContent(_props: React.ComponentPropsWithRef<"div">, children: React.ReactNode): React.ReactElement {
  return (
    <div className="modal modal-open">
      <div className="modal-dialog">
        <div className="modal-content">
          { children }
        </div>
      </div>
    </div>
  )
}

type dummyInputProps = {
  value: Input
  onChange: (value: Input) => void
}

function DummyInput (props: dummyInputProps): React.ReactNode {
  const { value, onChange } = props
  const { options, type, size, rating } = value

  switch (type) {
  case 'radio':
  case 'checkbox':
  case 'select':
    return <Options
      value={options}
      type={type}
      onChange={(options) => onChange({ ...value, options })} />
  case 'tel':
    return <input type="text" className="form-control dummy-input" disabled readOnly value="" />
  case 'url':
    return <input type="text" className="form-control dummy-input" disabled readOnly value="" />
  case 'email':
    return <input type="email" className="form-control dummy-input" disabled readOnly value="" />
  case 'text':
    return <input type="text" className="form-control dummy-input" disabled readOnly value="" placeholder="Short answer" />
  case 'textarea':
    return <textarea className="form-control dummy-input" readOnly placeholder="Paragraph" />
  case 'file':
    return (
      <>
        <input type="file" multiple={size > 1} className="form-control dummy-input" disabled />
        <FileInput value={value} onChange={onChange} />
      </>
    )
  case 'date':
    return <input type="date" className="form-control dummy-input" disabled readOnly value="" />
  case 'number':
    return <input type="number" className="form-control dummy-input" disabled readOnly value="" />
  case 'money':
    return <input type="text" className="form-control dummy-input" disabled readOnly value="R$ 0,00" />
  case 'multi':
    return <Multi value={value} onChange={onChange} />
  case 'address':
    return (
      <>
        <div className="form-group row">
          <label className="control-label col-md-12">CEP</label>
          <div className="col-md-4">
            <input type="text" className="form-control dummy-input" readOnly placeholder="00000-000" />
          </div>
        </div>

        <div className="form-group row">
          <label className="control-label col-md-12">Endereço</label>
          <div className="col-md-8">
            <textarea className="form-control dummy-input" readOnly placeholder="" />
          </div>
        </div>

        <div className="form-group optional row">
          <label className="control-label col-md-12">Complemento</label>
          <div className="col-md-8">
            <input type="text" className="form-control dummy-input" readOnly placeholder="" />
          </div>
        </div>
      </>
    )
  case 'rating':
    return <RatingInput
      value={rating}
      onChange={(rating: Rating) => onChange({ ...value, rating })} />
  }

  return null
}

/**
 * Creates a new empty input
 */
export function emptyInput(): Input {
  return {
    key: uuidv4(),
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
    options: [emptyOption('Option 1')],
    size: 1,
    maxsize: '',
    acceptAll: true,
    accept: [],
    rows: [emptyOption('Row 1')],
    columns: [emptyOption('Column 1')],
    rating: defaultRating(),
    validation: {
      minlength: '',
      maxlength: '',
      min: '',
      max: '',
      pattern: '',
    },
    advanced: {
      name: '',
      nameSet: false,
      placeholder: '',
      title: '',
      autocomplete: '',
      spellcheck: '',
    },
  }
}

/**
 * Duplicates a existing empty input
 */
export function duplicateInput(input: Input): Input {
  return {
    ...input,
    key: uuidv4(),
  }
}
