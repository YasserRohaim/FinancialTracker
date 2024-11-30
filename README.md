
# FinancialTracker

A financial tracker web application using NodeJS and ReactJS

  
  
  

## **Features**

  

- Users can signup and signin to their accounts.

- Users can add and delete transactions in different currencies.

- Users can view thier past transactions.

- Users can view insights (pie chart of their spending by currency).

  

---
## **Backend Endpoints**
| HTTP Verbs | Endpoints                  | Action                                                              |
|------------|----------------------------|---------------------------------------------------------------------|
| POST       | /users/signup              | To sign up a new user account                                       |
| POST       | /users/signin              | To log in an existing user account                                  |
| POST       | /transactions/create       | To create a new transaction                                         |
| GET        | /transactions/getall       | To retrieve all transactions belonging to the logged-in user        |
| DELETE     | /transactions/delete/:id   | To delete a specific transaction by ID                              |


  

## **Tech Stack**

  

### **Frontend**:

- Frameworks/Libraries: React

  

### **Backend**:

- Frameworks: Node.js (ExpressJS)

- Database: PostgreSQL

  

### **Other Tools**:

- Authentication: JWT

- APIs: fxfeed currency conversion rate API

-

  

---

  

## **Installation**

  

### **Prerequisites**

Node.js, PostgreSQL

  

### **Steps**

1. Clone the repository:
	
		gh repo clone YasserRohaim/FinancialTracker

		cd FinancialTracker

  

2. make sure that the Posgres service is running on your machine and create a new database

  

3. intialize the .env file in the following format:
	backend/.env:
		JWT_SECRET= GOOD_SECRET

		JWT_EXPIRES_IN= 7d

		CURRENCY_API_KEY= YOUR_KEY

		DB_USER= YOUR_USER

		DB_HOST= localhost

		DB_PASS= YOUR_PASS

		DB_NAME= DB_NAME

		DB_PORT= DB_PORT

		BACK_END_PORT=3001
	frontend/.env:
		REACT_APP_BACK_END_URL=http://localhost:3001

	
	

  
  

4. Install the requirements
		cp backend

		npm install
		
		cd ../frontend

		npm install

  

5.  run the react app and the server

		npm run frontend
		cd ../backend
		node index.js

  

6. open the react app on http://localhost:3000