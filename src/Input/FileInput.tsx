
import React, { ChangeEvent } from 'react'
import classnames from 'classnames'
import { Input } from './Input'

type FileInputProps = {
  value: Input
  onChange: (value: Input) => void
}

export default function FileInput (props: FileInputProps) {
  const { value, onChange } = props
  const { maxsize, size, acceptAll, accept } = value

  const handleAcceptChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { accept } = value
    if (e.target.checked) {
      onChange({ ...value, accept: accept.concat(e.target.value) })
    } else {
      onChange({ ...value, accept: accept.filter(t => t !== e.target.value) })
    }
  }

  return (
    <div className="input-file-config">
      <div className="input-row">
        <label htmlFor="" className="control-label">Allow only specific file types</label>
        <input
          type="checkbox"
          className="custom-control-input"
          checked={!acceptAll}
          onChange={(e) => onChange({ ...value, acceptAll: !e.target.checked })}/>
      </div>

      <div className={classnames('file-types', { hidden: acceptAll })}>
        <label className="custom-control custom-radio">
          <input
            type="checkbox"
            className="custom-control-input"
            checked={accept.indexOf('doc') !== -1}
            onChange={handleAcceptChange}
            value="doc" />
          <span className="custom-control-description">Document</span>
        </label>
        <label className="custom-control custom-radio">
          <input
            type="checkbox"
            className="custom-control-input"
            checked={accept.indexOf('ppt') !== -1}
            onChange={handleAcceptChange}
            value="ppt" />
          <span className="custom-control-description">Presentation</span>
        </label>
        <label className="custom-control custom-radio">
          <input
            type="checkbox"
            className="custom-control-input"
            checked={accept.indexOf('xls') !== -1}
            onChange={handleAcceptChange}
            value="xls" />
          <span className="custom-control-description">Spreadsheet</span>
        </label>
        <label className="custom-control custom-radio">
          <input
            type="checkbox"
            className="custom-control-input"
            checked={accept.indexOf('png') !== -1}
            onChange={handleAcceptChange}
            value="png" />
          <span className="custom-control-description">Drawing</span>
        </label>
        <label className="custom-control custom-radio">
          <input
            type="checkbox"
            className="custom-control-input"
            checked={accept.indexOf('pdf') !== -1}
            onChange={handleAcceptChange}
            value="pdf" />
          <span className="custom-control-description">PDF</span>
        </label>
        <label className="custom-control custom-radio">
          <input
            type="checkbox"
            className="custom-control-input"
            checked={accept.indexOf('img') !== -1}
            onChange={handleAcceptChange}
            value="img" />
          <span className="custom-control-description">Image</span>
        </label>
        <label className="custom-control custom-radio">
          <input
            type="checkbox"
            className="custom-control-input"
            checked={accept.indexOf('video') !== -1}
            onChange={handleAcceptChange}
            value="video" />
          <span className="custom-control-description">Video</span>
        </label>
        <label className="custom-control custom-radio">
          <input
            type="checkbox"
            className="custom-control-input"
            checked={accept.indexOf('audio') !== -1}
            onChange={handleAcceptChange}
            value="audio" />
          <span className="custom-control-description">Audio</span>
        </label>
      </div>

      <div className="input-row">
        <label htmlFor="" className="control-label">Maximum number of files</label>

        <input
          className="form-control"
          type="number"
          step="1"
          min="1"
          max="5"
          value={size}
          onChange={(e) => onChange({ ...value, size: parseInt(e.target.value, 10) })}/>
      </div>

      <div className="input-row">
        <label htmlFor="" className="control-label">Maximum file size</label>

        <div className="">
          <select
            className="custom-select form-control"
            value={maxsize}
            onChange={(e) => onChange({ ...value, maxsize: e.target.value })}>
            <option value="100kb">100 KB</option>
            <option value="500kb">500 KB</option>
            <option value="1mb">1 MB</option>
            <option value="2mb">2 MB</option>
          </select>
        </div>
      </div>
    </div>
  )
}
