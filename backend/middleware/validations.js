const { object, string, number, mixed, date } =require('yup');


const userSchema = object({
    name: string().required(),
    password:string().min(8,"minimum length is 8").required(),
    email: string().email().required(),
    budget: number().required().positive().integer(),
    preferredCurrency :  mixed()
    .oneOf(['USD', 'EUR', 'JPY', 'AED','EGP','SAR'], 'Invalid currency') 
    .required('Preferred currency is required'),
  });

  const transactionSchema = object({
    amount: number().required('Amount is required.').positive('Amount must be a positive number.'),
    origninal_currency :  mixed()
      .oneOf(['USD', 'EUR', 'JPY', 'AED','EGP','SAR'], 'Invalid currency') 
      .required('Original currency is required'),
    transaction_date: date().max(new Date(), 'Transaction date cannot be in the future.'),
    description: string().max(500, 'Description cannot exceed 500 characters.').optional()})

  const validateSchema = (schema) => {
    return (req, res, next) => {
      schema
        .validate(req.body, { abortEarly: false }) 
        .then(() => next()) 
        .catch((err) => {
          const errors = err.inner.map((e) => ({
            path: e.path,
            message: e.message,
          }));
          res.status(400).json({ errors });
        });
    };
  };

module.exports= {userSchema,transactionSchema, validateSchema };