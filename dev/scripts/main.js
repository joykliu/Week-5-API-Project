const PROPUBLICA_API = 'TWpoquMhTZ7eWzWg0704e6Pw7KM2UFyj1SmGjYbx';
const PROPUBLICA_BASE_URL = 'https://api.propublica.org/campaign-finance/v1/2016/races/';
const propublicaApp = {};

propublicaApp.getCandidates = (state) => {
    return $.ajax({
        url: PROPUBLICA_BASE_URL + state + '.json',
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

propublicaApp.getCandidates('CA');
