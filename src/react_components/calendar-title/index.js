import React from "react";
import styled from "styled-components";
import moment from "moment";
/*
______________________
|  day/month/year  x | header
----------------------
| May, 18        <  >| title: часть календаря, в которой пишется месяц и идет пролистывание страниц
----------------------
| 1| 2| 3| 4| 5| 6| 7| grid
----------------------
| 8| 9|10|11|12|13|14|
----------------------
|15|16|17|18|19|20|..|
----------------------
*/

const MainDivStyle = styled.div`
    display: flex;
    justify-content: space-between;
    background-color: #F8F8FF;
    padding: 10px;
`

const TextStyle = styled.span`
    font-size: 230%;
`

const ButtonStyle = styled.button`
    border: 0;
    height: 5vh;
    border-radius: 5px;
    margin-top: 10%;
    background-color: #dfdfe6;
    padding-right: 10px;
    padding-left: 10px;
`

const CalendarTitle = ({ prevPageHandler, todayPageHandler, nextPageHandler }) => {
    return(
        <MainDivStyle>
            <div>
                <TextStyle><b>{moment().format('MMMM')}</b></TextStyle>
                <TextStyle> {moment().format('YYYY')}</TextStyle>
            </div>
            <div>
                <ButtonStyle onClick={prevPageHandler}>&lt;</ButtonStyle>
                <ButtonStyle onClick={todayPageHandler}>Today</ButtonStyle>
                <ButtonStyle onClick={nextPageHandler}>&gt;</ButtonStyle>
            </div>
        </MainDivStyle>
    );
};

export { CalendarTitle };
