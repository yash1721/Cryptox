document.getElementById('other-coin').style.display = 'none';

document.getElementById('crypto-select').addEventListener('change', function () {
  if (document.getElementById('crypto-select').value == 'OTHER') {
    document.getElementById('other-coin').style.display = 'block';
  } else {
    document.getElementById('other-coin').style.display = 'none';
  }
});

document.getElementById('calculate').addEventListener('click', function (event) {
  event.preventDefault();
  const unit = document.getElementById('amount').value; // Added .value to get the input value
  const url = '/api/predict';
  const coinData = {
    coinName: document.getElementById('crypto-select').value == 'OTHER' ? document.getElementById('other-coin').value.toLowerCase() : document.getElementById('crypto-select').value,
    timeStamp: `${document.getElementById('exit-date').value} 00:00:00`
  };
  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(coinData),
  };

  fetch(url, option)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        var selling_price = parseFloat(data.message.slice(1, -1));
        var current_price = '';
        const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';
        const option = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        };

        fetch(url, option)
          .then(response => response.json())
          .then(cdata => {
            current_price = cdata[document.getElementById('crypto-select').value == 'OTHER' ? document.getElementById('other-coin').value.toLowerCase() : document.getElementById('crypto-select').value].usd;
            current_price = parseFloat(current_price);
          })
          .then(error => {
            console.log(error);
          });
        if (document.getElementById('SelectMarket-price').checked) {
          current_price = document.getElementById('buy-price').value;
        }
        document.getElementById('profit-heading').textContent = 'Total Profit Gained'
        document.getElementById('profit').textContent = '$' + (selling_price - current_price) * unit; // Assuming unit is a number

      } else {
        document.getElementById('Profit').textContent = data.message;
      }
    })
    .catch(error => {
      console.log(error);
    });
});

document.getElementById('SelectMarket-price').addEventListener('change', function () {
  document.getElementById('buy-price').disabled = document.getElementById('SelectMarket-price').checked;
});
