const api = {
    key: "6623ecf707e74a91a9560449241111",
    base: "https://api.weatherapi.com/v1/"
  }
  
  const searchbox = document.querySelector('#search_input');
  searchbox.addEventListener('keypress', setQuery);
  const storedData = JSON.parse(localStorage.getItem('weather'));

    // setQuery
    function setQuery(evt) {
      if (evt.keyCode == 13) {
        getResults(searchbox.value);
      }
    }

    // set Data DOMContentLoaded
    document.addEventListener("DOMContentLoaded", function () {
      getCitysData();
  
      if (storedData === null) {
        let c_index= Math.floor(Math.random() * (citys.length - 0 + 1) ) + 0;
        let random_city=citys[c_index];
        getResults(random_city);
  
        localStorage.setItem('weather', JSON.stringify(localStorageData(random_city)));
      }else{
        getResults(storedData.city)
      }
    });

    // getCitysData
    async function getCitysData() {
      let randomCities = [];
      for (let i = 0; i < 4; i++) {
        let cityIndex = Math.floor(Math.random() * citys.length);
        randomCities.push(citys[cityIndex]);
      }
    
      try {
        const weatherPromises = randomCities.map(city =>
          fetch(`${api.base}forecast.json?key=${api.key}&q=${city}&aqi=yes&alerts=yes}`).then(response => response.json())
        );
        const results = await Promise.all(weatherPromises);
        results.forEach(setCityData);
      } catch (error) {
        console.error("Error data for cities:", error);
      }
    }
  
    // setCityData
    let ind=0;
    function setCityData(weather) {
      // console.log(weather);
      let other_cities = document.querySelector('.other_cities');
      if (ind==0) {
        other_cities.innerHTML='';
        ind++
      }
      
        let common_box= document.createElement('div');
        common_box.classList.add('common-box');
    
        common_box.innerHTML = `
          <div class="content">
            <h5>${weather.current.temp_c}°C</h5>
            <p>${weather.location.name}, ${weather.location.country}</p>
          </div>
          <img src="${weather.current.condition.icon.replace('//cdn.weatherapi.com/weather/64x64/', './assets/image/icons/').replace('.png', '.svg')}" alt="">
        `;
        other_cities.appendChild(common_box)
    }


    // localStorage obj data
    function localStorageData(weather) {
      return data = {
        id: "12345",
        date: new Date().toLocaleString(), 
        city: weather.location.name 
      };
    }


    // get Search Results
    function getResults (query) {
      if (query.trim()!=='') {
      fetch(`${api.base}${query}forecast.json?key=${api.key}&q=$${query}&aqi=yes&alerts=yes&days=7`)
        .then(weather => {
          return weather.json();
        }).then(displayResults).catch(error => {
          console.error("Error fetching weather data:", error);
        });
      }else{
        alert("Error fetching weather data:")
      }
  
        // displayResults(query)
    }
  

    // display Search Results
    function displayResults (weather) {
      tody_data(weather);
      hours_data(weather)
      tody_more_data(weather)
      today_highlight(weather)
      tomorrow_data(weather)
      seven_day_data(weather)

      // setBackground(weather)

      // console.log(weather);

      if (storedData === null) {
        localStorage.setItem('weather', JSON.stringify(localStorageData(weather)));
      }
      else{

        storedData.city = weather.location.name
        localStorage.setItem('weather', JSON.stringify(storedData));
      }
    }


    // get_datetimeStr
    function get_datetimeStr(datetimeStr, key){
      // const datetimeStr = "2024-11-12 12:46";
        const date = new Date(datetimeStr.replace(" ", "T"));
        
        const options1 = {
          year: "numeric",
          day: "numeric",
          month: "short",
        };
  
        const options2 = {
          weekday: "long"
        };
  
        const options3 = {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        };
  
      switch (key) {
        case 'date':
            return date.toLocaleString("en-US", options1);
          break;
  
        case 'day':
            return date.toLocaleString("en-US", options2);
          break;
  
        case 'time':
            return date.toLocaleString("en-US", options3);
          break;
      
        default:
           ''
          break;
      }
  
    }

    // set tody_data
    function tody_data(data) {

        let tody_data = document.querySelector('.tody_data .current');
    
        tody_data.innerHTML=`
                              <div class="left_data">
                                <div>
                                    <div class="location"><i class="fa-solid fa-location-dot"></i> ${data.location.country}</div>
                                    <h2>${get_datetimeStr(data.location.localtime, 'day')}</h2>
                                    <h5>${get_datetimeStr(data.location.localtime, 'date')}</h5>
                                </div>
                               
                                <div>
                                  <h3>${get_datetimeStr(data.location.localtime, 'time')}</h3>
                                  <h5>${data.location.name +', '+ data.location.country}</h5>
                                </div>
                              </div>

                        <div class="center-data">
                            <h3 class="cel">${data.current.temp_c}<sup>o</sup>C</h3>
                            <h5>High: ${data.forecast.forecastday[0].day.maxtemp_c}    Low: ${data.forecast.forecastday[0].day.mintemp_c}</h5>
                        </div>

                        <div class="right-data">
                            <img src="${data.current.condition.icon.replace('//cdn.weatherapi.com/weather/64x64/', './assets/image/icons/').replace('.png','.svg')}" alt="">
                            <h3>${data.current.condition.text}</h3>
                        </div>`
    }

    // set hours_data
    function hours_data(data) {
        let hour_data=data.forecast.forecastday[0].hour;
        let hours_slider= document.querySelector('.hours_slider');
        hours_slider.innerHTML="";
        
        hour_data.forEach(hour_item => {
            let hours_data_box=document.createElement('div');
            hours_data_box.classList.add('hours_data-box');

             hours_data_box.innerHTML=`
                                  <div class="hours_data-inner">
                                    <p>${get_datetimeStr(hour_item.time, 'time')}</p>
                                    <img src="${hour_item.condition.icon.replace('//cdn.weatherapi.com/weather/64x64/', './assets/image/icons/').replace('.png','.svg')}" alt="">
                                     <p>${hour_item.temp_c}<sup>o</sup></p>
                                     <img src="./assets/image/navigation.png" style="transform: rotate(${hour_item.wind_degree}deg);" alt="">
                                    <p>${hour_item.wind_kph}km/p</p>
                                 </div>
                               `
             hours_slider.appendChild(hours_data_box);
        });   
    }


    // function hours_data(data) {
    //   let hour_data=data.forecast.forecastday[0].hour;
    //   let hours_slider= document.querySelector('.hours_slider .owl-stage');
    //   let owl_stage= document.querySelector('.hours_slider');
    //   hours_slider.innerHTML="";
      
    //   hour_data.forEach(hour_item => {
    //       let hours_data_box=document.createElement('div');
    //       hours_data_box.classList.add('owl-item');

    //        hours_data_box.innerHTML=`
    //                             <div class="hours_data-box">
    //                           <div class="hours_data-inner">
    //                               <p>${get_datetimeStr(hour_item.time, 'time')}</p>
    //                               <img src="${hour_item.condition.icon.replace('//cdn.weatherapi.com/weather/64x64/', './assets/image/icons/').replace('.png','.svg')}" alt="">
    //                                <p>${hour_item.temp_c}<sup>o</sup></p>
    //                                <img src="./assets/image/navigation.png" style="transform: rotate(${hour_item.wind_degree}deg);" alt="">
    //                               <p>${hour_item.wind_kph}km/p</p>
    //                            </div>
    //                           </div>
    //                          `
    //        hours_slider.appendChild(hours_data_box);
    //   });   
    // }



    // set tody_more_data
    function tody_more_data(data) {
      let tody_data = document.querySelector('.today_more_details');
  
      tody_data.innerHTML=`
                          <ul>
                            <li>
                                <div class="details_box">
                                  <img src="./assets/image/sunrise.png" alt="">
                                  <div class="content">
                                    <p>sunrise</p>
                                    <span>${data.forecast.forecastday[0].astro.sunrise}</span>
                                  </div>
                                </div>
                            </li>
                            <li>
                                <div class="details_box">
                                  <img src="./assets/image/sunset.png" alt="">
                                  <div class="content">
                                    <p>sunset</p>
                                    <span>${data.forecast.forecastday[0].astro.sunset}</span>
                                  </div>
                                </div>
                            </li>
                            <li>
                                <div class="details_box">
                                  <img src="./assets/image/moonrise.png" alt="">
                                  <div class="content">
                                    <p>moonrise</p>
                                    <span>${data.forecast.forecastday[0].astro.moonrise}</span>
                                  </div>
                                </div>
                            </li>
                            <li>
                             <div class="details_box">
                                  <img src="./assets/image/moonset.png" alt="">
                                  <div class="content">
                                    <p>moonset</p>
                                    <span>${data.forecast.forecastday[0].astro.moonset}</span>
                                  </div>
                                </div>
                            </li>
                          </ul>
                        `
    }

    // set today_highlight
    function today_highlight(data) {
      document.querySelector('.today_highlight #rain').innerText=`${data.forecast.forecastday[0].day.daily_chance_of_rain}`;
      document.querySelector('.today_highlight #uv').innerText=`${data.current.uv}`;
      document.querySelector('.today_highlight #wind').innerText=`${data.current.wind_kph}`;
      document.querySelector('.today_highlight #humidity').innerText=`${data.current.humidity}`;
    }


    // set tomorrow_data
    function tomorrow_data(data) {
      let tomorrow= document.querySelector('.tomorrow');

      tomorrow.innerHTML=` <div class="tomorrow-inner">
                    <div class="content">
                        <div class="left-content">
                            <h4>Tomorrow</h4>
                            <p>${data.forecast.forecastday[1].day.condition.text}</p>
                        </div>
                        <div class="center-content">
                          <h5>${data.forecast.forecastday[1].day.avgtemp_c}<sup>o</sup></h5>
                          <h6><span>High: ${data.forecast.forecastday[1].day.maxtemp_c}</span>    <span>Low: ${data.forecast.forecastday[1].day.mintemp_c}</span></h6>
                        </div>
                        <img src="${data.forecast.forecastday[1].day.condition.icon.replace('//cdn.weatherapi.com/weather/64x64/', './assets/image/icons/').replace('.png','.svg')}" alt="">
                      </div>
                  </div>
      `;
    }

    // set today_highlight
    function seven_day_data(data) {
      let seven_day_list= document.querySelector('.seven_day_list');
      // console.log(data.forecast.forecastday);
      
      data.forecast.forecastday.forEach(day_data => {
        let days_div=document.createElement('div');
        days_div.classList.add('seven_day_box');

        days_div.innerHTML=`<p>${day_data.day.condition.text}</p> 
                            <img src="${day_data.day.condition.icon.replace('//cdn.weatherapi.com/weather/64x64/', './assets/image/icons/').replace('.png','.svg')}" alt=""> 
                            <h5>${day_data.day.avgtemp_c}<sup>o</sup></h5>
                            <div class="center-content">
                              <h6><span>H: ${day_data.day.maxtemp_c}</span> <span>L: ${day_data.day.mintemp_c}</span></h6>
                            </div>
                            `;
        seven_day_list.appendChild(days_div);
      });
    }
      

    let dark_light_box = document.querySelector('.dark-light-box');
    let main = document.querySelector('main');
    dark_light_box.addEventListener('click', ()=>{
    
      dark_light_box.classList.toggle('light');
      main.classList.toggle('light');
    })
    
      


// $(".hours_slider").owlCarousel({
//     loop: false,
//     margin: 45,
//     nav: true,
//     dots: false,
//     autoplay: true,
//     autoplayTimeout: 3000,
//     autoplayHoverPause: true,
//     navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
//     responsive: {
//       0: {
//           items: 1,
//           margin: 20
//       },
//       700: {
//           items: 2,
//           margin: 20
//       },
//       1200: {
//         items: 4,
//         margin: 20
//       },
//       1400: {
//         items: 5,
//         margin: 20
//     }
//   }

// });




  // function setBackground(data) {
  //   let background_image=document.querySelector('.background_image');
    

  //     const background_data={
  //       'sunny': '/images/sunny.jpg',
  //       'clear': '/images/sunny.jpg',
  //       'partly cloudy': 'partlyCloudy.GIF',
  //       'cloudy': '/images/cloudy.jpg',
  //       'overcast': '/images/sunny.jpg',
  //       'mist': '/images/cloudy.jpg',
  //       'patchy rain possible': '/images/rainy.jpg',
  //       'patchy snow possible': '/images/snowy.jpg',
  //       'Patchy sleet possible': '/images/sunny.jpg',
  //       'patchy freezing drizzle possible': '/images/cloudy.jpg',
  //       'thundery outbreaks possible': '/images/rainy.jpg',
  //       'blowing snow': '/images/snowy.jpg',
  //       'blizzard': '/images/sunny.jpg',
  //       'fog': '/images/sunny.jpg',
  //       'freezing fog': '/images/sunny.jpg',
  //       'patchy light drizzle': '/images/sunny.jpg',
  //       'light drizzle': '/images/sunny.jpg',
  //       'freezing drizzle': '/images/sunny.jpg',
  //       'heavy freezing drizzle': '/images/sunny.jpg',
  //       'patchy light rain': '/images/sunny.jpg',
  //       'light rain': '/images/sunny.jpg',
  //       'moderate rain at times': '/images/sunny.jpg',
  //       'moderate rain': '/images/sunny.jpg',
  //       'heavy rain at times': '/images/sunny.jpg',
  //       'heavy rain': '/images/sunny.jpg',
  //       'light freezing rain': '/images/sunny.jpg',
  //       'moderate or heavy freezing rain': '/images/sunny.jpg',
  //       'light sleet': '/images/sunny.jpg',
  //       'moderate or heavy sleet': '/images/sunny.jpg',
  //       'patchy light snow': '/images/sunny.jpg',
  //       'light snow': '/images/sunny.jpg',
  //       'patchy moderate snow': '/images/sunny.jpg',
  //       'moderate snow': '/images/sunny.jpg',
  //       'patchy heavy snow': '/images/sunny.jpg',
  //       'heavy snow': '/images/sunny.jpg',
  //       'ice pellets': '/images/sunny.jpg',
  //       'light rain shower': '/images/sunny.jpg',
  //       'moderate or heavy rain shower': '/images/sunny.jpg',
  //       'torrential rain shower': '/images/sunny.jpg',
  //       'light sleet showers': '/images/sunny.jpg',
  //       'moderate or heavy sleet showers': '/images/sunny.jpg',
  //       'light snow showers': '/images/sunny.jpg',
  //       'moderate or heavy snow showers': '/images/sunny.jpg',
  //       'light showers of ice pellets': '/images/sunny.jpg',
  //       'moderate or heavy showers of ice pellets': '/images/sunny.jpg',
  //       'patchy light rain with thunder': '/images/sunny.jpg',
  //       'moderate or heavy rain with thunder': '/images/sunny.jpg',
  //       'patchy light snow with thunder': '/images/sunny.jpg',
  //       'moderate or heavy snow with thunder': '/images/sunny.jpg'
  //     }



  //   let condition_text=data.current.condition.text;
  //   condition_text= condition_text.toLowerCase();
  //   let backgroundImage= background_data[condition_text];

  //   console.log(backgroundImage);    
    
  //   background_image.style.backgroundImage=`url('./assets/image/background_image/rain.gif')`;

  // }