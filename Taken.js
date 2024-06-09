//   :3

async function fetchDataAndFilterDeadlines() {
    try {
        const currentUrl = window.location.href;
        const schoolName = currentUrl.split("/")[2];
        const plannerUrl = document.getElementById('datePickerMenu').getAttribute('plannerurl');
        const user = plannerUrl.split("/")[4];
        const date = await getDateInCorrectFormat(true, false);
        const endDate = await getDateInCorrectFormat(true, true);

        const url = `https://${schoolName}/planner/api/v1/planned-elements/user/${user}?from=${date}&to=${endDate}`;
        console.log(url);

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        // Filter data to include only items with deadlines
        const itemsWithDeadlines = data.filter(item => item.period && item.period.deadline);
        
        // Do something with itemsWithDeadlines
        console.log(itemsWithDeadlines);
        
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function fancyfyTime(inputTime) {
    const [startTime, endTime] = inputTime.split(' - ');

    function convertTo24HourFormat(time) {
        let [hours, minutes] = time.split(':');
        const period = time.match(/(AM|PM)/i)[0];
        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);
        
        if (period.toLowerCase() === 'pm' && hours !== 12) {
            hours += 12;
        } else if (period.toLowerCase() === 'am' && hours === 12) {
            hours = 0;
        }

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    const formattedStartTime = convertTo24HourFormat(startTime);
    const formattedEndTime = convertTo24HourFormat(endTime);
    return `${formattedStartTime} - ${formattedEndTime}`;
}

async function getDateInCorrectFormat(isFancyFormat, isEndDate) {
    let currentDate = new Date();
    
    if (isEndDate) {
        currentDate.setDate(currentDate.getDate() + 7);  // next week
    }

    if (currentDate.getHours() >= 18 || currentDate.getDay() === 5 && currentDate.getHours() >= 18 || currentDate.getDay() === 6 || currentDate.getDay() === 0) {
        currentDate.setDate(currentDate.getDate() + (8 - currentDate.getDay()));
        currentDate.setHours(7);
        currentDate.setMinutes(30);
    }

    if (isFancyFormat) {
        const day = currentDate.getDate().toString().padStart(2, '0');
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear();
        return `${year}-${month}-${day}`;
    } else {
        return currentDate;
    }
}

async function fetchPlannerData(date, user) {
    try {
        const currentUrl = window.location.href;
        const schoolName = currentUrl.split("/")[2];
        const url = `https://${schoolName}/planner/api/v1/planned-elements/user/${user}?from=${date}&to=${date}`;
        console.log(url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to fetch planner data');
        }
        
        const data = await response.json();
        const itemsWithDeadlines = data.filter(item => item.period && item.period.deadline);
        console.log(itemsWithDeadlines);

        return itemsWithDeadlines;
    } catch (error) {
        console.error('Failed to fetch:', error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const plannerUrl = document.getElementById('datePickerMenu').getAttribute('plannerurl');
    const user = plannerUrl.split("/")[4];
    const data = await fetchPlannerData(await getDateInCorrectFormat(true), user);
    console.log(data);
});
