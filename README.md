# Task Focus App and Automation Tester

### **Overview**
This repository contains the basic unit testing framework for the **Task Focus Application**. The testing is implemented using **Selenium WebDriver** and **unittest** in Python. Please note that this is a basic framework for functional testing, not a comprehensive testing suite. The tests primarily focus on core functionalities such as user registration, login, task creation, task editing, task completion, and task deletion.

### **Application Overview**
The **Task Focus App** is a simple task management application that allows users to:
1. **Register and Log in**: Users can register an account with their name, email, and password and then log in with those credentials.
2. **Dashboard**: Once logged in, users are directed to the dashboard where they can view their tasks.
3. **Task Management**: Users can add new tasks, edit existing tasks, mark tasks as completed, and delete tasks.
   - **Task Information**: Each task includes a title, description, priority, and due date.
   - **Priority Levels**: Tasks can be assigned priority levels (Low, Medium, High).

The application also integrates with a **MongoDB** database to store users' and tasks' information.

### **Functionalities**
1. **Registration**: New users can sign up using their name, email, and password.
2. **Login**: Registered users can log into their accounts using the credentials provided during registration.
3. **Task Addition**: Users can add tasks by specifying details like task title, description, priority, and due date.
4. **Task Editing**: Existing tasks can be edited by updating the title, description, or due date.
5. **Task Completion**: Tasks can be marked as complete with a visual indicator (e.g., a green icon).
6. **Task Deletion**: Tasks can be deleted from the dashboard.

### **Testing Overview**
This testing framework focuses on unit testing the core functionalities of the **Task Focus App**. The following are the primary tests included in the framework:

1. **Register User Test**: Verifies that a new user can successfully register.
2. **Login User Test**: Verifies that a registered user can log in with the correct credentials.
3. **Add Task Test**: Verifies that a user can add a task successfully.
4. **Edit Task Test**: Verifies that a task can be edited by updating its title and description.
5. **Complete Task Test**: Verifies that a user can mark a task as completed.
6. **Delete Task Test**: Verifies that a user can delete a task from their task list.

### **Testing Methodology**
Testing is performed using **Selenium WebDriver**, a popular tool for automating web browsers. The tests are written in **Python** using the **unittest** framework. The following steps outline the testing process:

1. **Setup**: 
   - The tests use a headless Chrome browser for testing the web application.
   - MongoDB is cleared before each test to ensure a fresh state for the database.
   
2. **Test Execution**:
   - Each test case follows the logical steps for performing specific user actions, such as filling in forms, clicking buttons, and verifying results.
   - Screenshots are taken for failed test cases to aid in debugging.

3. **Teardown**:
   - After each test case, the database is cleared, and the session is logged out to maintain a clean state for the next test.

### **Screenshots of The Application**

<p align="center">
  <img src="/records/Register.png" alt="Register" width="500"/>
</p>
<p align="center">
  <img src="/records/Login.png" alt="Login" width="500"/>
</p>
<p align="center">
  <img src="/records/Dashboard.png" alt="Dashboard" width="500"/>
</p>
<p align="center">
  <img src="/records/AddTask.png" alt="Add Task" width="500"/>
</p>

### **Demo Video of Testing using Selenium**

You can download or view the demo video [here](/records/short_demo_video.mp4).