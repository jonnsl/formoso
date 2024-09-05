
import React from 'react'

export type ValidationRules = {
  minlength: string
  maxlength: string
  min: string
  max: string
  pattern: string
}

type ValidationRulesProps = {
  type: string
  value: ValidationRules
  onChange: (value: ValidationRules) => void
}

export default function ValidationRulesForm (props: ValidationRulesProps) {
  const { type, value, onChange } = props
  const { minlength, maxlength, min, max, pattern } = value

  if (type === 'text' || type === 'textarea') {
    return (
      <>
        <div className="form-group">
          <label htmlFor="input_minlength" className="col-md-4 control-label">Minimum Length</label>
          <div className="col-md-6">
            <input
              id="input_minlength"
              type="number"
              min="1"
              max={maxlength}
              step="1"
              className="form-control"
              value={minlength}
              onChange={(e) => onChange({ ...value, minlength: e.target.value })} />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="input_maxlength" className="col-md-4 control-label">Maximum Length</label>
          <div className="col-md-6">
            <input
              id="input_maxlength"
              type="number"
              min={minlength}
              step="1"
              className="form-control"
              value={maxlength}
              onChange={(e) => onChange({ ...value, maxlength: e.target.value })} />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="input_pattern" className="col-md-4 control-label">Pattern</label>
          <div className="col-md-6">
            <input
              id="input_pattern"
              type="text"
              className="form-control"
              value={pattern}
              onChange={(e) => onChange({ ...value, pattern: e.target.value })} />
          </div>
        </div>
      </>
    )
  }

  if (type === 'number') {
    return (
      <>
        <div className="form-group">
          <label htmlFor="input_min" className="col-md-4 control-label">Minimum Value</label>
          <div className="col-md-6">
            <input
              id="input_min"
              type="number"
              max={max}
              step="1"
              className="form-control"
              value={min}
              onChange={(e) => onChange({ ...value, min: e.target.value })} />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="input_max" className="col-md-4 control-label">Maximum Value</label>
          <div className="col-md-6">
            <input
              id="input_max"
              type="number"
              min={min}
              step="1"
              className="form-control"
              value={max}
              onChange={(e) => onChange({ ...value, max: e.target.value })} />
          </div>
        </div>
      </>
    )
  }

  if (type === 'date') {
    return (
      <>
        <div className="form-group">
          <label htmlFor="input_min" className="col-md-4 control-label">Minimum Date</label>
          <div className="col-md-6">
            <input
              id="input_min"
              type="date"
              max={max}
              step="1"
              className="form-control"
              value={min}
              onChange={(e) => onChange({ ...value, min: e.target.value })} />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="input_max" className="col-md-4 control-label">Maximum Date</label>
          <div className="col-md-6">
            <input
              id="input_max"
              type="date"
              min={min}
              step="1"
              className="form-control"
              value={max}
              onChange={(e) => onChange({ ...value, max: e.target.value })} />
          </div>
        </div>
      </>
    )
  }

  return null
}
