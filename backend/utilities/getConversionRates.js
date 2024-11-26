 const getConversionRates = async(base,currencies) => {
 const API_KEY = process.env.CURRENCY_API_KEY;
 return fetch(
    `https://api.fxfeed.io/v1/latest?base=${base}&currencies=${currencies.join()}&api_key=${API_KEY}`
  )
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((data) => {
      
      console.log(data);
      if (data.success) {
        return data.rates;
      } else {
        console.log("Error:", data.error);
      }
    })
    .catch((error) => console.log("Fetch error:", error));

}
module.exports=getConversionRates;
