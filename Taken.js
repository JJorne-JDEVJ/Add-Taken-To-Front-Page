// pain ( au chocolat )

fetchDataAndFilterDeadlines() // the begining

async function fetchDataAndFilterDeadlines() {
    try {
        const currentUrl = window.location.href;
        const schoolName = currentUrl.split("/")[2];
        const plannerUrl = document.getElementById('datePickerMenu').getAttribute('plannerurl');
        const user = plannerUrl.split("/")[4];
        const date = await getDateInCorrectFormat(false, false);
        const endDate = await getDateInCorrectFormat(false, true);

        const url = `https://${schoolName}/planner/api/v1/planned-elements/user/${user}?from=${date}&to=${endDate}`;
        console.log(url);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        let data = await response.json();

        // Filter data to include only items with deadlines
        const itemsWithDeadlines = data.filter(item => item.period && item.period.deadline);

        createGUI(itemsWithDeadlines)

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
        currentDate.setDate(currentDate.getDate() + 7); // Assuming end date is next week
    }

    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');

    if (isFancyFormat) {
        // Fancy format
        return `${day}/${month}/${year}`;
    } else {
        // ISO format for API
        return `${year}-${month}-${day}`;
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

function createGUI(data) {
    console.log(data);
    
}
