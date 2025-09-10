# Mini-AI-App-Builder-Portal
A lightweight AI-powered app builder that allows users to describe their desired application with specific requirements. The portal leverages an AI API to capture inputs and automatically generates a basic mock UI based on the provided specifications.


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
*Result*
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
**Tech Stack
**
+ Frontend: **React**

+ Backend: **Node.js **(deployed on Render)

+ Database: **MongoDB** (Cloud instance)

+ AI Integration: **AI API for requirement extraction (API Key required)**


#
Project Structure
```
/client
  ├── src
  │   ├── components   # React components
  │   ├── pages        # Page views
  │   ├── services     # API integration
  │   └── App.js       # Main React app entry
/server
  ├── routes           # Backend routes
  ├── models           # MongoDB schema definitions
  └── index.js         # Express server entry
```
