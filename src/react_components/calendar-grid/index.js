import React from "react";
import moment from "moment";
import styled from "styled-components";

/*
______________________
|  day/month/year  x | header
----------------------
| May, 18        <  >| title
----------------------
| 1| 2| 3| 4| 5| 6| 7| grid: сетка календаря (GridStyle)
----------------------
| 8| 9|10|11|12|13|14|
----------------------
|15|16|17|18|19|20|..|
----------------------

---------------------- <- клетка сетки (CellStyle)
|                  27| <- день месяца (DateStyle) 
|           task 1   | <- задачи                  } <- строки ячейки клетки, выделенные под задачи (CellRowStyle)
|           task 2   |                            }
----------------------
*/

// styled-components: https://tproger.ru/articles/styled-components-idealnaja-stilizacija-react-prilozhenija/ 
// обертка для сетки календаря
const GridStyle = styled.div` 
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(6, 1fr);
    grid-gap: 1.5px;
    background-color: #c6c6cc;
`

// клетка сетки
// ширина и высота клетки зависят от ширины и высоты окна (12 и 11%)
const CellStyle = styled.div`
    min-width: 12vw;
    min-height: 11vh;
    background-color: ${props => props.isWeekend ? '#dfdfe6' : '#F8F8FF'};
`
// надписи внутри сетки
const CellRowStyle = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
`
// выделение текущего дня
const DateStyle = styled.div`
    height: 30%;
    width: 30%;
    display: flex;
    cursor: pointer;
    justify-content: center;
`

// отображение дня в правом углу
const ShowDateStyle = styled.div`
    display: flex;
    justify-content: flex-end;
`

// отображение списка задач (ul - неупорядоченный список)
const EventListStyle = styled.ul`
    margin: 0;
    list-style-position: inside;
    padding-left: 5%;
`

// отображение отдельных задач (button, т.к. при нажатии на задачу нужно ее редактировать)
const EventItemStyle = styled.button`
    position: relative;
    left: -10px;
    overflow: hidden;
    border: 0;
    background: 0;
    margin: 0;
    padding: 0;
    cursor: pointer;
    text-align: left;
`

const CalendarGrid = ({pageFirstDay, grid_events, openForm}) => {
        let startDay = pageFirstDay.clone().subtract(1, "day");
        let daysArray = [...Array(42)].map(() => moment(startDay.add(1, "day"))); // в календарной сетке 6 недель и 42 ячейки, с помощью map в каждую ячейку
                                                                                             // пишем день на 1 больший предыдущего
        return(
        <GridStyle>
        {
            daysArray.map((dayObject) => (
                <CellStyle key={dayObject.format("DDMMYYYY")} isWeekend={dayObject.day() == 6 || dayObject.day() == 0}>
                    <CellRowStyle>
                        <ShowDateStyle>
                        <DateStyle onDoubleClick =  {() => openForm("Create", { title: "", description: "", date: dayObject.format('X')})}>
                            {dayObject.format('D')}
                        </DateStyle>
                        </ShowDateStyle>
                        <EventListStyle>
                            {
                                /* к строке ниже: в ячейке будут отображаться только те задачи, у которых время находится между началом и концом выбранного дня */
                                grid_events.filter(event => event.date >= dayObject.format('X') && event.date <= moment(dayObject).endOf("day").format("X"))
                                                 .map(event => (<li key = {event.id}>
                                                                    <EventItemStyle onDoubleClick = {() => openForm("Update", event)}>
                                                                        {event.title}
                                                                    </EventItemStyle>
                                                                </li>))
                            }
                        </EventListStyle>
                    </CellRowStyle>
                </CellStyle>
            ))
        }
        </GridStyle>
    );
    // с помощью map для каждого объекта массива дней вычисляется уникальный ключ
    // для ячейки в виде полной даты, а день форматируется как число дня
}

export { CalendarGrid };
