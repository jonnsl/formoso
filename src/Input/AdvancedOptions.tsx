
import React from 'react'
import AutoCompleteOptions from './AutoCompleteOptions'
import { normalizeInputName, inputNameConstraints } from './utils'

export type AdvancedOptions = {
  name: string
  nameSet: boolean
  placeholder: string
  title: string
  autocomplete: string
  spellcheck: string
}

type AdvancedOptionsProps = {
  type: string
  value: AdvancedOptions
  onChange: (value: AdvancedOptions) => void
}

export default function AdvancedOptionsForm (props: AdvancedOptionsProps) {
  const { type, value, onChange } = props
  const { name, placeholder, title, autocomplete, spellcheck } = value

  const fielNameGroup = (
    <div className="form-group">
      <label htmlFor="input_n_ame" className="col-md-4 control-label">Field Name</label>
      <div className="col-md-6">
        <input
          id="input_n_ame"
          type="text"
          className="form-control"
          autoComplete="off"
          spellCheck="false"
          value={name}
          onKeyDown={inputNameConstraints}
          onChange={(e) => onChange({ ...value, nameSet: true, name: normalizeInputName(e.target.value) })} />
      </div>
    </div>
  )

  if (type !== 'text' && type !== 'textarea') {
    return fielNameGroup
  }

  return (
    <>
      { fielNameGroup }

      <div className="form-group">
        <label htmlFor="input_placeholder" className="col-md-4 control-label">Placeholder</label>
        <div className="col-md-6">
          <input
            id="input_placeholder"
            type="text"
            className="form-control"
            value={placeholder}
            onChange={(e) => onChange({ ...value, placeholder: e.target.value })} />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="input_title" className="col-md-4 control-label">Title</label>
        <div className="col-md-6">
          <input
            id="input_title"
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => onChange({ ...value, title: e.target.value })} />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="input_autocomplete" className="col-md-4 control-label">Autocomplete</label>
        <div className="col-md-6">
          <AutoCompleteOptions
            id="input_autocomplete"
            className="custom-select form-control"
            value={autocomplete}
            onChange={(e) => onChange({ ...value, autocomplete: e.target.value })} />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="input_spellcheck" className="col-md-4 control-label">Spellcheck</label>
        <div className="col-md-6">
          <select
            id="input_spellcheck"
            className="custom-select form-control"
            value={spellcheck}
            onChange={(e) => onChange({ ...value, spellcheck: e.target.value })}>
            <option value="">(Default)</option>
            <option value="true">on</option>
            <option value="false">off</option>
          </select>
        </div>
      </div>
    </>
  )
}
