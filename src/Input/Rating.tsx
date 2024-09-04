
import React from 'react'
import TextareaAutosize from 'react-textarea-autosize'

export type Rating = {
  worstLabel: string
  bestLabel: string
  ratingFrom: string
  ratingTo: string
}

export function defaultRating(): Rating {
  return {
    worstLabel: 'Bad',
    bestLabel: 'Good',
    ratingFrom: '0',
    ratingTo: '5',
  }
}

type RatingProps = {
  value: Rating
  onChange: (value: Rating) => void
}

export default function RatingInput (props: RatingProps) {
  const { value, onChange } = props
  const { worstLabel = '', bestLabel = '', ratingFrom = '0', ratingTo = '5' } = value
  let ratings: number[] = []

  const from = Number.isNaN(parseInt(ratingFrom, 10)) ? 0 : parseInt(ratingFrom, 10)
  const to = Number.isNaN(parseInt(ratingTo, 10)) ? 0 : parseInt(ratingTo, 10)

  if (to >= from) {
    ratings = (new Array(to - from + 1).fill(0).map((_, i) => i + parseInt(ratingFrom, 10)))
  }

  return (
    <table className="table table-ratings">
      <thead>
        <tr>
          <th></th>
          { ratings.map(r => <th key={r}>{r}</th>)}
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <TextareaAutosize
              className="seamless"
              onChange={(e) => onChange({ ...value, worstLabel: e.target.value })}
              value={worstLabel}/>
          </td>
          { ratings.map(r => <td key={r}><DummyRadio /></td>)}
          <td>
            <TextareaAutosize
              className="seamless"
              onChange={(e) => onChange({ ...value, bestLabel: e.target.value })}
              value={bestLabel}/>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={ratings.length + 2}>
            <label>
              <input
                type="number"
                className="form-control"
                value={ratingFrom}
                min="0"
                max={ratingTo}
                onChange={(e) => onChange({ ...value, ratingFrom: e.target.value })} />
            </label>
            { ' to ' }
            <label>
              <input
                type="number"
                className="form-control"
                value={ratingTo}
                min={ratingFrom}
                max="10"
                onChange={(e) => onChange({ ...value, ratingTo: e.target.value })} />
            </label>
          </td>
        </tr>
      </tfoot>
    </table>
  )
}

function DummyRadio () {
  return <input type="radio" checked={false} readOnly tabIndex={-1} />
}
