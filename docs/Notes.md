## Background
Basically I tried building a personal system in Notion that tracks my expense and what I eat everyday.
It worked but as I added more entries, some of the aggregations went bad and I had some problems with the user experience. 
1. When calculating the taxes, it is hard for me to have a tax ratio and tax amount field so that I can input either one and the other one renders itself.
2. When choosing what I ate today, it is hard to not show the things that I have finished.
and then I have to look at the date when the item names are similar. 
3. Previously I create a food that I cook with multiple ingredients, and then I would just keep track of how many times I ate it and the number of days I had it, well I think I am keeping this.
4. Have to be able to add subscriptions easily. 

## Thoughts
Lets go through the workflow
1. First of all this needs to have a frontend that can display very neatly so I think the user experience is very important haha. 
2. I think the backend will be defined according what I want to do ? TO BE DEFINED
3. The schema of the database would be pretty important
I guess the easy local application will be the above
First come up with a dirty code at first. (a little CI)

4. Seems like putting it onto docker has to be done before the testing and deployment
4. After that add testing and start deploying - then start the CI/CD
5. Add benchmarking and system design as I actually go into system design
6. Can have one version of putting onto the cloud. 

7. Then maybe try adding another application so that the system becomes more complex.

## To Do 
11/18 
1. Decide the things to use
- Frontend: React, Typescript
- Backend: python, fastAPI
- Database: postgreSQL
- CI: github action
- CD: dockers

11/20
1. Plan the schema
2. Define functionalities of the project

11/21 
Create backend and Frontend to make it work

your-project/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   │   ├── expenses.py
│   │   │   ├── purchases.py
│   │   │   └── __init__.py
│   │   ├── db/
│   │   │   ├── database.py
│   │   │   ├── models.py
│   │   │   └── __init__.py
│   │   ├── schemas/
│   │   │   ├── expenses.py
│   │   │   └── __init__.py
│   │   └── __init__.py
│   ├── poetry.lock / requirements.txt
│   └── venv/ (optional)
│
└── frontend/
    ├── src/
    │   ├── App.tsx
    │   ├── components/
    │   │   └── ExpenseForm.tsx
    │   └── pages/
    ├── package.json
    └── vite.config.ts





## Problems
1. Where do I start ? 
start developing with the backend because I have to define the functions that I want to have for the frontend to connect, and you also need to have the database schema setup.
Start with SQLite and then migrate to postgreSQL with docker, because postgre has to be set up as a server and sqlite is already builtin in python.

2. How should I test the backend ?
After having backend APIs, should use unit tests like pytest or FastAPI TestClients  
I can first build the frontend so that I have a full structure and then later on I will start deploying so that I can do CI/CD.

3.

## Journal
> 11/20
> 
> [Plan database schema](database.md)  
> write SQLAlchemy for it

> 11/21
> [Backend Setup](backend.md) - Have the backend apis written  
> Although I should test the backend with self-written tests but I think I can first develop the frontend because I have to develop it anyways  
> [Frontend Setup](frontend.md) - Need a frontend to trigger the backend

> 11/28
> Continue [Frontend Development](frontend.md) 