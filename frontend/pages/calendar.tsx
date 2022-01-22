import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DragAndDropCalendar from "../components/Calendar/DragAndDropCalendar";
import Layout from "../components/Layout/Layout";


const CalendarPage = () => {
  return (
    <Layout>
      <DragAndDropCalendar />
    </Layout>
  );
};

export default CalendarPage;
