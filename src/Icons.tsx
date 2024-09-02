
import React from 'react'

type DivProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export function Grip (props: DivProps) {
  const { className, ...propsToPass } = props

  return (
    <div {...propsToPass} className={className ? className + ' no-ouline' : 'no-ouline'}>
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" focusable="false" viewBox="0 0 12 12">
        <g fill="currentColor">
          <rect width="2" height="2" x="3" y="1" rx=".5" ry=".5"/>
          <rect width="2" height="2" x="7" y="1" rx=".5" ry=".5"/>
          <rect width="2" height="2" x="3" y="5" rx=".5" ry=".5"/>
          <rect width="2" height="2" x="7" y="5" rx=".5" ry=".5"/>
          <rect width="2" height="2" x="3" y="9" rx=".5" ry=".5"/>
          <rect width="2" height="2" x="7" y="9" rx=".5" ry=".5"/>
        </g>
      </svg>
    </div>
  )
}

export function Triangle (props: DivProps) {
  const { className, ...propsToPass } = props
  return (
    <div {...propsToPass} className={className ? className + ' no-ouline' : 'no-ouline'}>
      <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" focusable="false" viewBox="0 0 10 10">
        <polygon points="0,0 10,0 0,10"></polygon>
      </svg>
    </div>
  )
}
