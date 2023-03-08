import React from "react";
import styled from "styled-components";
/*
______________________
|  day/month/year  x | header: часть календаря c выбором масштаба и прочими настройками
----------------------
| May, 18        <  >| title
----------------------
| 1| 2| 3| 4| 5| 6| 7| grid
----------------------
| 8| 9|10|11|12|13|14|
----------------------
|15|16|17|18|19|20|..|
----------------------
*/

const MainDivStyle = styled.div`
    background-color: #F8F8FF;
    height: 5vh;
`
// TODO
const CalendarHeader = () => {
    return(
        <MainDivStyle>CalendarHeader</MainDivStyle>
    );
};

export { CalendarHeader };
