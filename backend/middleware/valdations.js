const { object, string, number } =require('yup');


const userSchema = object({
    name: string().required(),
    password:string().min(8,"minimum length is 8").required(),
    email: string().email(),
    budget: number.positive(),
    preferredCurrency :  mixed()
    .oneOf(['USD', 'EUR', 'JPY', 'AED','EGP','SAR'], 'Invalid currency') 
    .required('Preferred currency is required'),
  });

module.exports= userSchema;