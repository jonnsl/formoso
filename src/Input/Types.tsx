

import React from "react"

type InputTypesProps = React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>

const validTypes = [
  'tel', 'url', 'email', 'rating', 'address', 'text', 'textarea', 'radio',
  'checkbox', 'select', 'file', 'date', 'number', 'money', 'multi',
]

export default function InputTypes (props: InputTypesProps): React.ReactNode {
  const value = props.value
  const invalidType = typeof value === 'string' && validTypes.indexOf(value) === -1

  return (
    <select {...props} >
      <option value="text">Short Answer</option>
      <option value="textarea">Paragraph</option>
      <option value="radio">Multiple choice</option>
      <option value="checkbox">Checkboxes</option>
      <option value="select">Dropdown</option>
      <option value="file">File upload</option>
      <option value="date">Date</option>
      <option value="number">Number</option>
      <option value="money">Money</option>
      <option value="multi">Multiple-choice grid</option>
      <option value="address">Address</option>
      <option value="rating">Rating</option>
      <option value="email">E-Mail</option>
      <option value="tel">Telephone</option>
      <option value="url">URL</option>
      { invalidType? <option value={value}>Unknown Type &quot;{ value }&quot;</option> : null }
    </select>
  )
}

