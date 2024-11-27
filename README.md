
# FinancialTracker

A financial tracker web application using NodeJS and ReactJS

  
  
  

## **Features**

  

- Users can signup and signin to their accounts.

- Users can add and delete transactions in different currencies.

- Users can view thier past transactions.

- Users can view insights (pie chart of their spending by currency).

  

---

  

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

		JWT_SECRET= GOOD_SECRET

		JWT_EXPIRES_IN= 7d

		CURRENCY_API_KEY= YOUR_KEY

		DB_USER= YOUR_USER

		DB_HOST= localhost

		DB_PASS= YOUR_PASS

		DB_NAME= DB_NAME

		DB_PORT= DB_PORT

		BACK_END_PORT=3001

  
  

4. Install the requirements

		npm install

		cd frontend

		npm install

  

5. get back to the root directory and run the server

		cd ..

		npm run start

  

6. open the react app on http://localhost:3001