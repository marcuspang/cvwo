# CVWO Project: Task Management Project

Done by Marcus Pang Yu Yang

## Features

1. Authentication
   - [ ] Users can register/login using traditional email and password through Go backend and OAuth
   - [ ] Validation is done on frontend and backend
2. Tasks
   - [ ] Users can create/delete/update tasks
   - [ ] Tasks are stored in a list
   - [ ] Tasks have due dates and labels
   - [ ] Tasks can be dragged and dropped into other lists
   - [ ] Tasks can be seen on the calendar
3. Lists
   - [ ] Users can create/delete/update lists
   - [ ] Lists can be sorted based on creation date, labels, alphabetical order
   - [ ] Lists can be assigned colours
4. Calendar
   - [ ] Users can see all tasks with due dates assigned
   - [ ] Clicking on a date creates a new task
5. Miscellaneous
   - [ ] Board/List view
   - [ ] Trash bin to show recently deleted tasks
   - [ ] Users can search through tasks and lists
   - [ ] Notifications can be given based on the due date
   - [ ] Tasks can be shared/assigned to other users (edit access)
   - [ ] Lists can be shared/assigned to other users (edit access)
   - [ ] Dark mode

# Tech stack

## Frontend

- React.js
- Next.js
- Redux
- Typescript
- ChakraUI

## Backend

- Golang
- gofiber
- GORM
- jwt-go
- PostgreSQL

Database Tables
![Database Tables](./database_tables.png)

## Tutorials/UI Frameworks

- https://www.youtube.com/watch?v=X9WULjvgqTY&list=PLlameCF3cMEvoymqJrVrvwx5VLLpjin8r (gofiber tutorial)
- https://chakra-templates.dev/ (ChakraUI templates)
- https://choc-ui.tech/ (ChakraUI templates)


## Separate TODOs
- [x] add query param for reading archived tasks/lists
- [x] change archive endpoint to /object/id/archive 
- [ ] abstract process of checking whether user is authorized to modify object (list/task)
- [ ] standardise error interface and error messages
- [ ] optimise database queries