# 11/20
## Database schema plan
The first approach was to use SQLAlchemy to create a database because it helps you design databases in a OOP way. After that you migrate the database to create/alter tables. 

I think it is called ORM + migrations and chatgpt strongly recommends it.
The benfit of defining through python ORM is that you can track changes for long-term projects. 
Another benefit is the migration from SQLite to postgreSQL 
Here we use SQLAlchemy + Albemic

### Function Definition
However, before that, I have to define the things that I need in the database.

1. User inputs ?
2. What are the things that user want to see ? 
- Spending / Time (Day, Year, )
- Spending / Category
- Spending / Place
- Spending / Meal 
- Spending Charts 
- Tax / expense
- Tip / expense
- Amount of Money saved through discounts (measure the impact of discounts)

3. Spending can have other metadata
- Spending chart - expenses have time 
- Spending Category - expenses have a category
- Spending Place - expenses have a place 

### Expense Table
Expenses need the amount, the discount (can be percent or fixed number), and the price, the tax, the tip, a purchase id, the thing id

the thing id includes the name of the item, what the item is (item_id), and the category of the item (category id)
- different stores use different names, but people might buy the same stuff again 
- the item is a canonical field that kind of connects different names 
- users can define their own category and name

Category table  
similarly, multiple same stuff can be in the same category


Items table 
- this table is kind of an internal table that is used to connect different but kind of the same products together.


Because different receipts have different ways of inputing an expense, I will separate a input into another table, for example. 
- Original , discount  (Costco), No amount 
- Amount, unit price 
- Amount, unit price, original unit price (hmart)
- price, discount, no amount

### Purchase Table
Purchases need location, time, discount (if there is a whole discount, or a discount on the whole purchase), maybe a receipt, and the final price, I would say that this is the second protection of the database so that no value is missed 

#### Completed : Purchase, Expense

### Spending / Meal 
In order to have spending per meal, I first will need a meal.
Tracking meals is a good habit, and usually you choose among the things that you have as a meal. 
Now the problem is meals are usually either cooked or by dining out. 
- If dining out, the expense will be the meal itself, or sometimes if the meal is a very large portion, it can be eaten twice. 
- If cooked. I could have a food table that puts those in the inventory as ingredients and create a food. However, then I would first need to have an inventory table where I will have to consider sharing with people. 

Meals table : 

Inventory table :

### Conclusion 1 : 
In order to keep things simple at first, I am going to build up the first edition.

## SQLAlchemy Basic Undersanding
Python’s most powerful library for working with databases.
### Core 
Low-level SQL (you write SQL-like Python code)

### ORM (Object Relational Mapper)
High-level, turns database rows into Python objects.

### Intro 
1. You want to use python classes to represent your data  
    Think of python classes, objects and object relations instead of SQL tables rows and columns
2. Works with many databases  
    - Handles SQL for you where ORM generates the queries for you.   
    - When turning from ORM to SQL it can turn into many databases instead of just one 
    - Helps prevent SQL injection

### Essential Concepts
1. Engine - connects python with database
2. Session - Database conversation, kind of like activating the connection ?
3. Base - Determine which Python classes are database models and
how to generate tables from them
4. Model - python classes that are database tables
5. Column - database column
6. Foreign Keys - Relationship define

### problem 
How do I give a field two kinds of data either to represent percent or an integer  
Best practice: keep one numeric column and add a “what this number means” column.

### Turn the schema into a graph 
from backend.db.database import Base
from eralchemy2 import render_er
render_er(Base, "schema.png")