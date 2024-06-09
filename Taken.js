// nog niet klaar...

function fetchDataAndFilterDeadlines() {
  const currentUrl = window.location.href;
  const school_name = currentUrl.split("/")[2];
  const plannerUrl = document.getElementById('datePickerMenu').getAttribute('plannerurl');
  const user = plannerUrl.split("/")[4]);
  const date = await getDateInCorrectFormat(true, false)
  const endDate = await getDateInCorrectFormat(true, true
                                              )
  const url = `https://${school_name}.smartschool.be/planner/api/v1/planned-elements/user/${user}?from=${date}&to=${endDate}`;
  console.log(url);
  
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Filter data to include only items with deadlines
      const itemsWithDeadlines = data.filter(item => item.period.deadline);
      
      // Do something with itemsWithDeadlines
      console.log(itemsWithDeadlines);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

async function getDateInCorrectFormat(isFancyFormat, plusOneWeek) {
    if (plusOneWeek){
      let currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 7);
    }else{
        let currentDate = new Date();
    }
    if (currentDate.getHours() >= 18) {
        currentDate.setDate(currentDate.getDate() + 3);
        currentDate.setHours(7);
        currentDate.setMinutes(30);
    } else if (currentDate.getDay() === 5 && currentDate.getHours() >= 18) {
        currentDate.setDate(currentDate.getDate() + 3);
        currentDate.setHours(7);
        currentDate.setMinutes(30);
    } else if (currentDate.getDay() === 6 || currentDate.getDay() === 0) {
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
