const PROPUBLICA_API = 'TWpoquMhTZ7eWzWg0704e6Pw7KM2UFyj1SmGjYbx';
const PROPUBLICA_BASE_URL = 'https://api.propublica.org/campaign-finance/v1/2016/races/DE.json';
const propublicaApp = {};

propublicaApp.getCandidates = () => {
    return $.ajax({
        url: PROPUBLICA_BASE_URL,
        dataType: 'json',
        method: 'GET',
        beforeSend: function (request)
            {
                request.setRequestHeader('X-API-Key', PROPUBLICA_API);
            }
    }).then(results => {
        console.log(results)
    })
}

propublicaApp.getCandidates();
