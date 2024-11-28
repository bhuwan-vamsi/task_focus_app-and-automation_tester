import unittest
from pymongo import MongoClient
from utilities.helpers import log_error, log_success, load_csv_data


class TestDatabase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = MongoClient("mongodb://localhost:27017/")
        cls.db = cls.client["task_manager_test"]
        cls.users = cls.db["users"]
        cls.tasks = cls.db["tasks"]
        cls.test_data = load_csv_data("C:\\Users\\bhunv\\OneDrive\\Desktop\\Projects\\task_focus_app-and-automation_tester\\testing\\database_testing\\test_data.csv")
        cls.users.delete_many({})
        cls.tasks.delete_many({})
        print("Database cleared before all tests")

    def test_01_user_registration(self):
        test_name = "test_user_registration"
        try:
            self.users.delete_many({})  # Clear all users
            for row in self.test_data:
                if row["test_type"] == "create_user":
                    user = {"name": row["name"], "email": row["email"], "password": row["password"]}
                    result = self.users.insert_one(user)
                    self.assertTrue(result.inserted_id)
                    TestDatabase.user_id = result.inserted_id  # Save user ID globally
                    log_success(test_name, f"User registered: {row['name']}")
        except Exception as e:
            log_error(test_name, str(e))
            raise e

    def test_02_user_login(self):
        test_name = "test_user_login"
        try:
            user = self.users.find_one({"email": "john@example.com"})
            self.assertIsNotNone(user, "User must exist for login")
            TestDatabase.user_id = user["_id"]
            log_success(test_name, f"User logged in: {user['email']}")
        except Exception as e:
            log_error(test_name, str(e))
            raise e

    def test_03_task_add(self):
        test_name = "test_add_task"
        try:
            self.tasks.delete_many({})  # Clear all tasks
            self.assertIsNotNone(TestDatabase.user_id, "User must be logged in before adding a task")

            for row in self.test_data:
                if row["test_type"] == "create_task":
                    task = {
                        "title": row["title"],
                        "description": row["description"],
                        "priority": row["priority"],
                        "dueDate": row["dueDate"],
                        "completed": row["completed"] == "True",
                        "user": TestDatabase.user_id
                    }
                    result = self.tasks.insert_one(task)
                    self.assertTrue(result.inserted_id)
                    TestDatabase.task_id = result.inserted_id  # Save task ID globally
                    log_success(test_name, f"Task created: {row['title']}")
        except Exception as e:
            log_error(test_name, str(e))
            raise e

    def test_04_task_update(self):
        test_name = "test_update_task"
        try:
            self.assertIsNotNone(TestDatabase.task_id, "Task must be created before updating")

            for row in self.test_data:
                if row["test_type"] == "update_task":
                    self.tasks.update_one(
                        {"_id": TestDatabase.task_id},
                        {"$set": {"description": row["description"], "priority": row["priority"]}}
                    )
                    updated_task = self.tasks.find_one({"_id": TestDatabase.task_id})
                    self.assertEqual(updated_task["description"], row["description"])
                    log_success(test_name, f"Task updated: {row['title']}")
        except Exception as e:
            log_error(test_name, str(e))
            raise e

    def test_05_task_complete(self):
        test_name = "test_complete_task"
        try:
            self.assertIsNotNone(TestDatabase.task_id, "Task must be created before marking as complete")

            for row in self.test_data:
                if row["test_type"] == "complete_task":
                    self.tasks.update_one({"_id": TestDatabase.task_id}, {"$set": {"completed": True}})
                    completed_task = self.tasks.find_one({"_id": TestDatabase.task_id})
                    self.assertTrue(completed_task["completed"])
                    log_success(test_name, f"Task marked as completed: {row['title']}")
        except Exception as e:
            log_error(test_name, str(e))
            raise e

    def test_06_task_delete(self):
        test_name = "test_delete_task"
        try:
            self.assertIsNotNone(TestDatabase.task_id, "Task must be created before deletion")

            for row in self.test_data:
                if row["test_type"] == "delete_task":
                    self.tasks.delete_one({"_id": TestDatabase.task_id})
                    deleted_task = self.tasks.find_one({"_id": TestDatabase.task_id})
                    self.assertIsNone(deleted_task)
                    log_success(test_name, f"Task deleted: {row['title']}")
        except Exception as e:
            log_error(test_name, str(e))
            raise e

    @classmethod
    def tearDownClass(cls):
        cls.client.drop_database("task_manager_test")
        cls.client.close()


if __name__ == "__main__":
    unittest.main()
