import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import BoxDisplay from "./BoxDisplay";

export default function SortableBox(props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: props.box._id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <BoxDisplay {...props} />
    </div>
  );
}
