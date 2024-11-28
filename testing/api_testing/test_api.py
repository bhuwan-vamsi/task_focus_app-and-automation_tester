import unittest
import requests
from pymongo import MongoClient
from utilities.helpers import log_error, log_success, load_csv_data

BASE_URL = "http://localhost:8000"


class TestAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Load test data
        cls.test_data = load_csv_data(
            "C:\\Users\\bhunv\\OneDrive\\Desktop\\Projects\\task_focus_app-and-automation_tester\\testing\\api_testing\\test_data.csv"
        )
        cls.token = None  # To store authentication token for task-related operations
        cls.task_id = None  # To store the created task ID for subsequent tests

        # Connect to MongoDB and clear the test database
        cls.client = MongoClient("mongodb://localhost:27017/")
        cls.db = cls.client["test"]
        cls.db["users"].delete_many({})  # Clear users collection
        cls.db["tasks"].delete_many({})  # Clear tasks collection
        print("Cleared the test database.")

    @classmethod
    def tearDownClass(cls):
        # Close the MongoDB connection
        cls.client.close()
        print("Closed the database connection.")

    def test_01_user_registration(self):
        test_name = "test_user_registration"
        try:
            for row in self.test_data:
                if row["test_type"] == "register":
                    response = requests.post(f"{BASE_URL}/users/register", json={
                        "name": row["name"],
                        "email": row["email"],
                        "password": row["password"]
                    })
                    print("Register Response:", response.status_code, response.json())
                    self.assertEqual(response.status_code, 201)
                    log_success(test_name, f"User registered: {row['name']}")
        except Exception as e:
            log_error(test_name, str(e))
            raise e

    def test_02_user_login(self):
        test_name = "test_user_login"
        try:
            for row in self.test_data:
                if row["test_type"] == "login":
                    response = requests.post(f"{BASE_URL}/users/login", json={
                        "email": row["email"],
                        "password": row["password"]
                    })
                    print("Login Response:", response.status_code, response.json())
                    self.assertEqual(response.status_code, 200)
                    TestAPI.token = response.cookies.get("token")  # Save token as class-level variable
                    print(f"Token after login: {TestAPI.token}")
                    self.assertIsNotNone(TestAPI.token, "Token should not be None")
                    log_success(test_name, f"User logged in: {row['email']}")
        except Exception as e:
            log_error(test_name, str(e))
            raise e

    def test_03_add_task(self):
        test_name = "test_add_task"
        try:
            if not TestAPI.token:
                self.fail("Token is missing. Ensure user login succeeds before running task tests.")

            for row in self.test_data:
                if row["test_type"] == "create_task":
                    response = requests.post(f"{BASE_URL}/tasks", json={
                        "title": row["title"],
                        "description": row["description"],
                        "priority": row["priority"],
                        "dueDate": row["dueDate"]
                    }, cookies={"token": TestAPI.token})  # Use class-level token
                    print("Add Task Response:", response.status_code, response.json())
                    self.assertEqual(response.status_code, 201)
                    TestAPI.task_id = response.json().get("_id")  # Save task ID as class-level variable
                    print(f"Task ID after creation: {TestAPI.task_id}")
                    log_success(test_name, f"Task added: {row['title']}")
        except Exception as e:
            log_error(test_name, str(e))
            raise e

    def test_04_update_task(self):
        test_name = "test_update_task"
        try:
            if not TestAPI.task_id:
                self.fail("Task ID is missing. Ensure task addition succeeds before running update tests.")

            for row in self.test_data:
                if row["test_type"] == "update_task":
                    response = requests.put(f"{BASE_URL}/tasks", json={
                        "id": str(TestAPI.task_id),
                        "description": row["description"],
                        "priority": row["priority"]
                    }, cookies={"token": TestAPI.token})
                    print("Update Task Response:", response.status_code, response.json())
                    self.assertEqual(response.status_code, 200)
                    log_success(test_name, f"Task updated: {TestAPI.task_id}")
        except Exception as e:
            log_error(test_name, str(e))
            raise e

    def test_05_mark_task_completed(self):
        test_name = "test_mark_task_completed"
        try:
            if not TestAPI.task_id:
                self.fail("Task ID is missing. Ensure task addition succeeds before marking as completed.")

            for row in self.test_data:
                if row["test_type"] == "complete_task":
                    response = requests.put(f"{BASE_URL}/tasks", json={
                        "id": str(TestAPI.task_id),
                        "completed": True
                    }, cookies={"token": TestAPI.token})
                    print("Complete Task Response:", response.status_code, response.json())
                    self.assertEqual(response.status_code, 200)
                    log_success(test_name, f"Task marked as completed: {TestAPI.task_id}")
        except Exception as e:
            log_error(test_name, str(e))
            raise e

    def test_06_delete_task(self):
        test_name = "test_delete_task"
        try:
            if not TestAPI.task_id:
                self.fail("Task ID is missing. Ensure task addition succeeds before deletion.")

            for row in self.test_data:
                if row["test_type"] == "delete_task":
                    response = requests.delete(
                        f"{BASE_URL}/tasks",  # Use the base URL for the delete endpoint
                        json={"id": TestAPI.task_id},  # Pass the ID in the body
                        cookies={"token": TestAPI.token},  # Include authentication token in cookies
                    )
                    try:
                        response_json = response.json()
                    except requests.exceptions.JSONDecodeError:
                        response_json = None
                        print("Response body is empty or invalid JSON")

                    print("Delete Task Response:", response.status_code, response_json)
                    self.assertEqual(response.status_code, 200)
                    log_success(test_name, f"Task deleted: {TestAPI.task_id}")
        except Exception as e:
            log_error(test_name, str(e))
            raise e


if __name__ == "__main__":
    unittest.main()
