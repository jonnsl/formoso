
import React from 'react'
import { Column, Input, Row } from './Input'
import Options from './Options'

type MultiProps = {
  value: Input
  onChange: (value: Input) => void
}

export default function Multi (props: MultiProps): React.ReactNode {
  const { value, onChange } = props
  const { rows, columns } = value

  return (
    <>
      <MultiPreview rows={rows} columns={columns} />
      <div className="multiple-choice-grid">
        <div>
          <Options
            value={rows}
            type="select"
            defaultLabel="Row %d"
            addNewLabel="Add new row"
            onChange={(rows) => onChange({ ...value, rows })} />
        </div>
        <div>
          <Options
            value={columns}
            type="radio"
            defaultLabel="Column %d"
            addNewLabel="Add new column"
            onChange={(columns) => onChange({ ...value, columns })} />
        </div>
      </div>
    </>
  )
}

type MultiPreviewProps = {
  rows: Row[]
  columns: Column[]
}

function MultiPreview (props: MultiPreviewProps): React.ReactNode {
  const { rows, columns } = props

  const radioColumns = columns.map(() => <td><input type="radio" className="custom-control-input" readOnly tabIndex={-1}></input></td>)

  return (
    <table className="multiple-choice-preview">
      <thead>
        <tr>
          <th></th>
          { columns.map((c) => <th>{c.label}</th>) }
        </tr>
      </thead>
      <tbody>
          { rows.map((c) => <tr><td>{c.label}</td>{ radioColumns }</tr>) }
      </tbody>
    </table>
  )
}
