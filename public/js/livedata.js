var inputtoapimap = {
    'Avalanche':'avalanche-2',
    'Binance':'binancecoin',
    'Bitcoin':'bitcoin',
    'Cardano':'cardano',
    'Decentraland':'decentraland',
    'Dogecoin':'dogecoin',
    'Ethereum':'ethereum',
    'Ripple':'ripple',
    'Solana':'solana',
    'Tether':'tether'

}
function fetchdata ()  {
    var key =document.getElementById('CoinName').textContent.trim() ;
    var coinName = inputtoapimap[key];
    const apiurl =  'https://api.coingecko.com/api/v3/coins/' + coinName;
    axios.get(`http://localhost:3000/api/livedata/?url=${apiurl}`)
    .then(response => {
        let mData = response.data ;
        document.getElementById('market_data.market_cap_change_percentage_24h').textContent = mData.market_data.market_cap_change_percentage_24h;
        document.getElementById('market_data.ath.usd').textContent = '$'+mData.market_data.ath.usd;
        document.getElementById('market_data.atl.usd').textContent = '$'+mData.market_data.atl.usd;
        document.getElementById('sentiment_votes_up_percentage').textContent = '$'+mData.sentiment_votes_up_percentage ;
        document.getElementById('market_data.high_24h').textContent = '$'+mData.market_data.high_24h["usd"];
        document.getElementById('market_data.low_24h').textContent = '$'+mData.market_data.low_24h["usd"] ;
        document.getElementById('market_data.current_price.usd').textContent = '$'+mData.market_data.current_price.usd;
        document.getElementById('market_data.market_cap.usd').textContent = '$'+mData.market_data.market_cap.usd;
        // document.getElementById('market_data.price_change_24h_in_currency.usd').textContent = mData.market_data.price_change_24h_in_currency.usd;
        document.getElementById('market_data.total_volume.usd').textContent = '$'+mData.market_data.total_volume.usd;
        document.getElementById('market_data[circulating_supply]').textContent = '$'+mData.market_data["circulating_supply"];
        document.getElementById('community_data.twitter_followers').textContent = '$'+mData.community_data.twitter_followers;

    })
    .catch(error =>{
        console.log(error);
    })
}
function displayRedLight ()
{
    const prevcolor = document.getElementById('market_data.current_price.usd').style.color;
    document.getElementById('market_data.current_price.usd').style.color='red';
    setTimeout(() => {
        document.getElementById('market_data.current_price.usd').style.color = prevcolor;
      }, 1000);
}
setInterval(fetchdata,20000);
setInterval(displayRedLight, 19000);