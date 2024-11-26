 const getConversionRates = async(base,currencies) => {
 const apiKey = "fxf_ZxBMjIG3kCUWozSPT47n";
 fetch(
    `https://api.fxfeed.io/v1/latest?base=${base}&currencies=${currencies.join()}&api_key=${apiKey}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      //console.log("Parsed Data:", data);
      if (data.success) {
        //console .log(data.rates);
        return data.rates;
      } else {
        console.log("Error:", data.error);
      }
    })
    .catch((error) => console.log("Fetch error:", error));
  return 0;

}
module.exports=getConversionRates;
