// nog niet klaar...

function fetchDataAndFilterDeadlines() {
  const url = 'https://{school}.smartschool.be/planner/api/v1/planned-elements/user/{user}?from={date}&to={date+1week}';

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

// Call the function to fetch data and filter deadlines
fetchDataAndFilterDeadlines();
