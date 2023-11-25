const imageContainer = document.getElementById('upper-left-container')
document.getElementById('nft-image').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imageContainer.style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(file);
    }
})
document.getElementById('create-auction').addEventListener('click', function (event) {
    event.preventDefault();
    const file = document.getElementById('nft-image').files[0];
    if (!file) {
        document.getElementById('error-text').textContent = 'Please Upload The image'
    }
    else {
        console.log(document.getElementById('starting-time').value)
        console.log(document.getElementById('starting-date').value)
        const auctionData = new FormData();
        auctionData.append('name', document.getElementById('auction-name').value);
        auctionData.append('startingbid', document.getElementById('starting-bid').value);
        auctionData.append('startingdate', document.getElementById('starting-date').value);
        auctionData.append('startingtime', document.getElementById('starting-time').value);
        auctionData.append('duration', document.getElementById('time-duration').value);
        auctionData.append('image', file)
        const url = 'http://localhost:3000/auctionCreate/'
        fetch(url, {
            method: 'POST',
            body: auctionData,
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.success === true) {
                    document.getElementById('error-text').style.color='green';
                    document.getElementById('error-text').textContent = data.message;
                }
                else {
                    document.getElementById('error-text').textContent = data.message;
                }
            })
            .then(error => {
                console.log(error);
            })
    }
})