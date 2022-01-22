import { Calendar, momentLocalizer, Event } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop, {
  withDragAndDropProps,
} from "react-big-calendar/lib/addons/dragAndDrop";
import { useState } from "react";

interface DragAndDropCalendarProps {}

const localizer = momentLocalizer(moment); // or globalizeLocalizer

const DragAndDropCalendar = ({}: DragAndDropCalendarProps) => {
  const [events, setEvents] = useState<Event[]>([
    {
      title: "Learn cool stuff",
      start: new Date(),
      end: new Date(),
    },
  ]);

  const onEventResize: withDragAndDropProps["onEventResize"] = (data) => {
    const { start, end } = data;

    setEvents((currentEvents) => {
      const firstEvent = {
        start: new Date(start),
        end: new Date(end),
      };
      return [...currentEvents, firstEvent];
    });
  };

  const onEventDrop: withDragAndDropProps["onEventDrop"] = (data) => {
    console.log(data);
  };
  return (
    // @ts-ignore
    <DnDCalendar
      localizer={localizer}
      startAccessor="start"
      endAccessor="end"
      defaultView="week"
      onEventDrop={onEventDrop}
      onEventResize={onEventResize}
      events={[
        {
          title: "test",
          start: new Date(),
          end: new Date(),
          allDay: false,
        },
      ]}
    />
  );
};

// @ts-ignore
const DnDCalendar = withDragAndDrop(Calendar);

export default DragAndDropCalendar;
