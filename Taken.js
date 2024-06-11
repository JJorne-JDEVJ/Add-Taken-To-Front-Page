// pain ( au chocolat )

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

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
    createGUI(itemsWithDeadlines)
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

function createGUI(data) {
    try {
        console.log(data);
        const takencontainer = document.getElementById('takencontainer')
        let takenbanner = document.createElement('span');
        takenbanner.classList.add('takenHeader');
        takenbanner.innerHTML = `<b>Taken</b>`
        takencontainer.appendChild(takenbanner);

        let options = { weekday: 'long', day: 'numeric', month: 'long' };
        for (var i = 0; i < data.length; i++) {
            let cur = data[i]

            let date = new Date(cur.period.dateTimeFrom);
            let formattedDate = date.toLocaleString('nl-BE', options);
            console.log(formattedDate); // bv Maandag 1 September
        }
    }catch(error){
        console.error('Error during creation of taken GUI', error)
    }
}
