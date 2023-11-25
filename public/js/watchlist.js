function removeCoin (coinName)
{
    const url = 'http://localhost:3000/watchlist'
    const coinData = 
    {
        coinName : coinName 
    }
    const option = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(coinData),
    };
    fetch(url , option)
    .then(response => {
        return response.json();
    })
    .then(data => {
        window.location.href = '/watchlist'
    })
    .then(error => {
        console.log(error)
    })

}