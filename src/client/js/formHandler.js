import { handleURL } from "./formChecker";

// event.preventDefault()
let allData = {};
//let form = document.querySelector('form');
    const geoNamesUrl = 'http://api.geonames.org/searchJSON?q=';
    const username = "diana_szalai";
    const weatherbitUrl= 'https://api.weatherbit.io/v2.0/forecast/daily?';
    const ApiKey= '6c93fef169ea443692a449b79c652cf8';
    const pixabayUrl = 'https://pixabay.com/api/?key=';
    const pixabayAPI = '17209347-c5f003843d069024e54cd72f8';

export function handleSubmit(e) {
        e.preventDefault(); //Prevent default behaviour to stop page reload
        // Getting element value from DOM
        //details['to'] = document.getElementById('name').value;   
        allData.destination = document.getElementById('name').value;
        let text = document.getElementById('name').value;
        const departure =new Date(document.getElementById('departure_date').value );
        const arrival =new Date(document.getElementById('arrival_date').value );
        console.log(`This is to see the date`)
        var startDate = departure.getTime();
        var endDate = arrival.getTime();
        var stampDate= Math.floor((endDate-startDate) / (60 * 60 *  24 * 1000));
        allData.stampDate = stampDate
        console.log(`Calculate the diff:`)
        console.log(stampDate)
         //Check the input destination 
        if (text.length !== 0){
        try {
            // Fetching geo stats of destination place.
            getGeoDetails(allData.destination)
                .then((toInfo) => {
                    //Assigning the fetched value from JSON toInfo
                    console.log('2')
                    console.log(toInfo)
                    const latt = toInfo.geonames[0].lat;
                    const long = toInfo.geonames[0].lng;
                    allData.name = toInfo.geonames[0].name;
                    allData.countryCode = toInfo.geonames[0].countryCode
                    console.log(latt, long)
                    //Getting Weather details
                    return getWeatherData(latt, long) 
                })
                .then((weatherData) => {
                    console.log(1)
                    console.log(weatherData)
                    //Storing the weather info
                    allData.temperature = weatherData.data[0].temp
                    allData.weatherDesc= weatherData.data[0].weather.description
                    allData.weatherIcon= weatherData.data[0].weather.icon
                    console.log(allData.weatherIcon)
                    //Calling Pixabay API to fetch the first img of the city
                    return getImage(allData.destination);
                })
                .then((imageDetails) => {
                    if (imageDetails.hits.length > 0) {
                        allData.cityImage = imageDetails.hits[0].webformatURL ;
                        updateInfo(allData);
                    }
                })
        } catch (e) {
            console.log('error', e);
        }
     }
}
    // Function to get Geo stats
async function getGeoDetails(to) {
    const response = await fetch(geoNamesUrl + to + '&maxRows=1&username=' + username);
    try {
        return await response.json();
    } catch (e) {
        console.log('(1)There was an error :', e);
    }
}

//Function to get weather data
async function getWeatherData(latt, long ) {
        const response = await fetch(weatherbitUrl + '&lat=' + latt + '&lon=' + long + '&key=' + ApiKey);
        console.log(`${weatherbitUrl }'&lat='${latt}'&lon='${long}'&key='${ApiKey}`)
        try {
        return await response.json();
        //return await response.json();
    } catch (e) {
        console.log('(2)There was an error :', e)
    }
}

async function getImage(city) {
    const apiURL = `${pixabayUrl}${pixabayAPI}&q=${city}&image_type=photo`
    console.log(`api pixabay`)
    console.log(apiURL)
    const response = await fetch(pixabayUrl + pixabayAPI + '&q=' + city + '&image_type=photo');
    //console.log('3')
    //console.log(response)
    try {
        return await response.json();
    } catch (e) {
        console.log('(3)There was an error :', e);
    }
}

async function calculateTime(date) {
    const response = await fetch(pixabayUrl + pixabayAPI + '&q=' + city + '&image_type=photo');
    //console.log('3')
    //console.log(response)
    try {
        return await response.json();
    } catch (e) {
        console.log('(3)There was an error :', e);
    }
}

//Updating the UI
function updateInfo(allData) {
    document.getElementById('myAnchor').src = allData.cityImage;
    document.querySelector('.cityName').textContent = allData.name;
    document.querySelector('.countryCode').textContent = allData.countryCode
    document.getElementById('iconID').src = `/src/client/views/icons/${allData.weatherIcon}.png`;
    console.log(`/src/client/views/icons/${allData.weatherIcon}.png`)
    document.querySelector('.temperature').textContent =`${allData.temperature} °C` ;
    document.querySelector('.weatherDescription').textContent = allData.weatherDesc;
    document.querySelector('.travelTime').textContent = allData.stampDate;
} 

