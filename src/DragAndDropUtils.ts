
import { DraggableProvided } from "react-beautiful-dnd"

export function limitMovementToYAxis (draggableProps: DraggableProvided['draggableProps']): DraggableProvided['draggableProps'] {
  if (draggableProps.style) {
    draggableProps.style = {
      ...draggableProps.style,
      transform: removeXAxisFromTranslate(draggableProps.style.transform),
    }
  }

  return draggableProps
}

function removeXAxisFromTranslate (transformProperty: string | null | undefined): string | undefined {
  if (transformProperty === null || transformProperty === undefined) {
    return undefined
  }

  const matches = transformProperty.match(/^translate\((-?[0-9]+)px, (-?[0-9]+)px\)$/)
  if (matches === null) {
    return transformProperty
  }
  const yAxis = matches[2]
  if (yAxis === undefined) {
    return transformProperty
  }

  return `translate(0, ${yAxis}px)`
}
