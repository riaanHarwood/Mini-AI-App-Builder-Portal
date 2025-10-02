# Mini-AI-App-Builder-Portal
The Mini Ai App Builder Portal is a lightweight AI-powered platform that allows users to describe their desired application with specific requirements. The portal leverages an AI API using OpenAI GPT4o and DALL-E 3 to capture inputs and automatically generates a basic mock UI based on the provided specifications.


This project showcases my ability to implement AI-driven requirement gathering and dynamic UI generation with **React, Node.js (Render)**, and **MongoDB**. 


##
**Features** 
**Requirement Capture Portal**

+ Input box for entering a natural language description of the desired app.

+ AI-powered extraction of:

  + App Name
 
  + Entities
 
  + Roles
 
  + Features

+ Clean and minimal UI to review captured requirements.

**Auto-Generated Mock UI**

+ Generates a basic demo interface based on captured requirements.

+ Creates forms for each Entity with sample input fields.

+ Provides menus/tabs for Roles and Features.

+ Non-functional mock UI (for demonstration purposes only).


#
**Example**

The following example if from the PDF provided to me by Decoded hiring team
```css
I want an app to manage student courses and grades. Teachers add courses, students enrol, and admins manage reports.
```
*Result*: 

AI Captured Requirements:

+ App Name: **Course Manager**

+ Entities: **Student, Course, Grade**

+ Roles: **Teacher, Student, Admin**

+ Features: **Add Course, Enrol Students, View Reports**

Generated Mock UI:

+ Menu: Student | Teacher | Admin

+ Forms:
  
  + **Student** → Name, Email, Age

  + **Course** → Title, Code, Credits

  + **Grade** → Student, Course, Grade
 

#
**Tech Stack**
+ Frontend: **React**

+ Backend: **Node.js** (deployed on Render)

+ Database: **MongoDB** (Cloud instance)

+ Backend/API testing: **Postman**

+ AI Integration: **OpenAI GPT4o + DALL·E for requirement extraction (API Key required)**


#
**Project Structure**

*I've designed the project structure to separate responsibilities for clarity and efficiency. The frontend, built with React, focuses on displaying the AI-driven interface, while the backend handles API requests, database operations, and AI processing to keep everything running smoothly*

```
/backend
  ├── src
  │   ├── .env         #store API and Database keys 
  │   ├── components   # React components
  │   ├── services     # API integration
  │   ├── aiRouter     # Manages AI API from OpenAI GPT4o 
  │   └── App.js       # Main React app entry
/frontend
  ├── routes           # Backend routes
  ├── pages             # Page views
  ├── models           # MongoDB schema definitions
  └── index.js         # Express server entry
```
#

**⚡ Getting Started**
Prerequisites

Node.js (>= 18.x recommended)

MongoDB Atlas or local instance

AI API key (e.g., OpenAI API key)

#
**Installation**
```
git clone https://github.com/riaanHarwood/Mini-AI-App-Builder-Portal.git
cd Mini-AI-App-Builder-Porta
```

**Install dependencies for both frontend and backend:**
```
cd client
npm install

cd ../server
npm install
```

**Run the App**
Start the backend server: 
```
cd server
npm run dev
```

Start the frontend 
```
cd client
npm start
```

The app should now be running at:
```
Frontend: http://localhost:3000
Backend: http://localhost:5050
```

**Future Improvements**
+ Add authentication & role-based access.
+ Improve AI prompt engineering for more accurate requirement extraction.
+ Deploy frontend to Vercel/Netlify/Gitgub Pages.


#
📜 **License**
This project is licensed under the MIT License.
