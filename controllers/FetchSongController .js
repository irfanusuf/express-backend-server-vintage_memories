
const fetch = require('node-fetch');
const getSongsController = async (req ,res)=>{
 

    const url = 'https://spotify-web2.p.rapidapi.com/search/?q=hollywood&type=multi&offset=0&limit=10&numberOfTopResults=5';
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '79bd850338msh2791f9644fac656p197751jsnac6970a86c03',
        'X-RapidAPI-Host': 'spotify-web2.p.rapidapi.com'
      }
    };
    
    try {
      const response = await fetch(url, options);
      const result = await response.text();
      res.json({message: " api working " , result})
      
    } catch (error) {
      console.error(error);
    }
  }
  


  module.exports = getSongsController