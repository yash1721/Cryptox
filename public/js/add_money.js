const form = document.querySelector('form') ;
form.addEventListener('submit' , function(event)  {
    event.preventDefault() ;
    const money_amount = document.getElementById('amount-input').value;
    form.action = `/add_money/${money_amount}`;
    form.submit()
})