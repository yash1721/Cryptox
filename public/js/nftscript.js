const dark = document.querySelector(".dark");
const light = document.querySelector(".light");

dark.addEventListener("click", function () {
  document.querySelector("body").classList.add("darkMode");
  light.classList.remove("active");
  dark.classList.add("active");
});

light.addEventListener("click", function () {
  document.querySelector("body").classList.remove("darkMode");
  dark.classList.remove("active");
  light.classList.add("active");
});
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("bid-button")) {
    var eventId = event.target.getAttribute('aria-label');
    console.log(eventId);
    const eventData = {
      id: eventId,
    }
    const option = {
      method: 'POST',
      body: JSON.stringify(eventData),
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const url = 'http://localhost:3000/nftdashboard'
    fetch(url,option)
    .then(response => response.json())
    .then(data => {
        // const startTime = data.data.startTime
        const startTime = Date.now();
        const currentTime = Date.now();
        const endTime = data.data.startTime + data.data.duration*60*1000
        if (currentTime >= startTime && currentTime <= endTime) {
          const auctionId = encodeURIComponent(data.data._id.toString())
          window.location.href = `/auction/?id=${auctionId}`
        }
        else  {
          const days = (startTime - currentTime) / (1000 * 60 * 60 * 24) ;
          const daysrem = Math.floor(days)
          const hrs = (startTime - currentTime - (daysrem *24 *60*60*1000)) / (1000 * 60 * 60)
          const hrsrem = Math.floor(hrs)
          alert("Time remaining is => " + daysrem + " days and " + hrsrem + " hrs ")
        }
    })
    .then(error => {
      console.log(error)
    })
  }
})
