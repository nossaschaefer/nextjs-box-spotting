import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import BoxDisplay from "./BoxDisplay";

export default function SortableBox(props) {
  // const currentViewMode = viewModeForBox[box._id] || viewMode;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: props.box._id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <BoxDisplay {...props} dragListeners={listeners} />
    </div>
  );
}
