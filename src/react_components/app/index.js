import moment from 'moment'; // библиотека moment для работы с временем и датами
                             // для установки зайди в терминале в директорию со своим проектом и 
                             // npm install moment --save
import styled from "styled-components"; 
import {useEffect, useState} from "react";
import {CalendarHeader} from "../calendar-header"; // см. файлы в react-components
import {CalendarTitle} from "../calendar-title";
import {CalendarGrid} from "../calendar-grid";

const CalendarStyle = styled.div`
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 20px #ccc;
`

// положение формы, в которую записываются события
const FormPosStyle = styled.div`
    position: absolute;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
`
// стиль формы
const FormStyle = styled(CalendarStyle)`
    width: 20vw;
    background-color: aliceblue;
    box-shadow: unset;
`
// записи в календаре
const EventStyle = styled.input`
    padding: 5px 15px;
    font-size: 85%;
    width: 100%;
    border: 0;
    outline: 0;
    border-bottom: 1px solid #c6c6cc;
    background-color: aliceblue;
    color: #c6c6cc;
`

const ButtonsWrap = styled.div`
    margin-bottom: 5px;
    margin-left: 1px;
    margin-right: 1px;
`

// кнопки внутри формы
const ButtonsStyle = styled.button`
  justify-items: center;
  outline: none;
  border: none;
  height: 4vh;
  background-color: #e5e5eb;
  border-radius: 5px;
  margin-top: 10%;
  padding-right: 10px;
  padding-left: 10px;
  margin-left: 1px;
  margin-right: 1px;
  cursor: pointer;
`

// ссылка, по которой лежит сервер с нашими данными
const jsonUrl = `http://localhost:3001`;
function App() {
    moment.updateLocale("en", {week: {dow: 1}}); // локаль надо менять, потому что здесь неделя начинается с воскресенья
    let pageFirstDay = moment().startOf("month").startOf("week");

    // ниже: метка первого дня на странице календаря определенного месяца и последнего, чтобы выводить только события на этой странице
    const startDayFilter = moment(pageFirstDay).format('X');
    const endDayFilter = moment(pageFirstDay).add(42, "days");
    useEffect(() => {
        // fetch получает наши данные о записях по заданной ссылке и фильтру, описанному выше, эти данные преобразуются в json и хранятся в events
        fetch(`${jsonUrl}/events?date_gte=${startDayFilter}&date_lte${endDayFilter}`)
            .then(res => res.json())
            .then(res => setEvents(res));
    },[]); // TODO себе: добавить зависимость после того, как будет готово перелистывание месяцев

    // это хуки - они позволяют функциональному компоненту, которым является function App, иметь свое состояние
    // позже я попробую переписать этот компонент под классовый, чтобы он мог иметь состояние без этих конструкций
    // пока оставляю так, о хуках: https://reactjs.org/docs/hooks-intro.html, о компонентах: https://reactjs.org/docs/components-and-props.html
    const [method, setMethod] = useState(null); // метод, выбранный в форме события (добавить новое событие или изменить старое)
    const [event, setEvent] = useState(null); // выбранное событие для редактирования/добавления
    const [isFormShowing, setShowForm] = useState(false); // определение того, нужно показывать форму для ввода событий или нет
    const[events, setEvents] = useState([]); // события, которые отображаются на данной странице календаря

    // открытие формы ввода для выбранного события и действия (обновление или создание нового события)
    const openForm = (methodName, eventToUpdate) => {
        console.log("fd", methodName);
        setShowForm(true);
        setEvent(eventToUpdate);
        setMethod(methodName);
    }

    // обработка нажатия на кнопку отмены
    const cancelButton = () => {
        setShowForm(false);
        setEvent(null);
    }

    // здесь при изменении значения в форме ввода соответствующему полю события присваивается новое значение
    const changeEvent = (text, field) => {
        setEvent(previousState => ({...previousState, [field]:text}));
    }

    // обновление либо создание события (в этом методе к серверу подаются запросы POST (для создания новой записи)
    // или PATCH (для внесения изменений в старую запись)
    const eventHandler = () => {
        const url = method == "Update" ? `${jsonUrl}/events/${event.id}` : `${jsonUrl}/events`; // если нужно обновить запись, обращение идет по ссылке на запись
        const httpMethod = method == "Update" ? 'PATCH' : 'POST';
        fetch(url, {
            method: httpMethod,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
        }).then(res => res.json()).then(res => {
            if(method == "Create")
                setEvents(state => [...state, res]);
            else {
                setEvents(state => state.map(event => event.id == res.id ? res : event));
            }
            cancelButton();
        });
    }

    // удаление события (в этом методе к серверу подается запрос DELETE для удаления записи по id
    const removeEventHandler = () => {
        const url = `${jsonUrl}/events/${event.id}`;
        const httpMethod = "DELETE";

        fetch(url, {
            method: httpMethod,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(res => {
            setEvents(state => state.filter(thisEvent => thisEvent.id != event.id));
            cancelButton();
        })
    }
  return (
      <>
          {
              isFormShowing ? (
                  <FormPosStyle>
                      <FormStyle>
                          <EventStyle value = {event.title}
                                      onChange = {e => changeEvent(e.target.value, "title")}
                          />
                          <EventStyle value = {event.description}
                                     onChange = {e => changeEvent(e.target.value, "description")}
                          />
                          <ButtonsWrap>
                              <ButtonsStyle onClick={cancelButton}>Cancel</ButtonsStyle>
                              <ButtonsStyle onClick={eventHandler}>{method}</ButtonsStyle>
                              <ButtonsStyle onClick={removeEventHandler}>Delete</ButtonsStyle>
                          </ButtonsWrap>
                      </FormStyle>
                  </FormPosStyle>
              ) : null
          }
          <CalendarStyle>
              <CalendarHeader />
              <CalendarTitle />
              <CalendarGrid pageFirstDay = {pageFirstDay} grid_events = {events} openForm = {openForm}/>
          </CalendarStyle>
      </>
  );
}

export default App;
