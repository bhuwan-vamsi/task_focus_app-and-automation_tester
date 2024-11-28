import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
import time
from pymongo import MongoClient


class TestTaskManagement(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Setup Chrome options for headless browsing
        chrome_options = Options()
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=600x600")

        # Initialize the WebDriver
        service = Service(ChromeDriverManager().install())  # Use Service class
        cls.driver = webdriver.Chrome(service=service, options=chrome_options)  # Pass the service to the driver
        cls.driver.get("http://localhost:3000")
        time.sleep(15)  # Wait for the page to load

        # Initialize MongoDB connection
        cls.client = MongoClient("mongodb://localhost:27017/")
        cls.db = cls.client["test"]
        cls.users = cls.db["users"]
        cls.tasks = cls.db["tasks"]

        # Clear the database before all tests
        cls.users.delete_many({})
        cls.tasks.delete_many({})
        print("Database cleared before all tests")

    def register_user(self):
        """Helper function to register a new user."""
        self.driver.get("http://localhost:3000/register")
        try:
            WebDriverWait(self.driver, 10).until(  # Increased wait time
                EC.presence_of_element_located((By.NAME, "register"))
            )
            self.driver.find_element(By.NAME, "name").send_keys("Test User")
            self.driver.find_element(By.NAME, "email").send_keys("testuser@example.com")
            self.driver.find_element(By.NAME, "password").send_keys("testPassword")
            self.driver.find_element(By.NAME, "register").click()
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.NAME, "login"))
            )
        except Exception as e:
            self.driver.save_screenshot("register_user_error.png")  # Take a screenshot for debugging
            print(f"Error in registering user: {e}")
            raise

    def login_user(self):
        """Helper function to log in with the registered user."""
        self.driver.get("http://localhost:3000/login")
        try:
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.NAME, "login"))
            )
            self.driver.find_element(By.NAME, "email").send_keys("testuser@example.com")
            self.driver.find_element(By.NAME, "password").send_keys("testPassword")
            self.driver.find_element(By.NAME, "login").click()
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "h2"))
            )
        except Exception as e:
            self.driver.save_screenshot("login_user_error.png")  # Take a screenshot for debugging
            print(f"Error in logging in: {e}")
            raise

    def test_add_task(self):
        self.register_user()
        self.login_user()
        """Test case for adding a task."""
        WebDriverWait(self.driver, 10).until(  # Increased wait time
            EC.element_to_be_clickable((By.CLASS_NAME, "bi-plus"))
        )
        self.driver.find_element(By.CLASS_NAME, "bi-plus").click()

        time.sleep(5)

        self.driver.find_element(By.NAME, "title").send_keys("Test Task")
        self.driver.find_element(By.NAME, "description").send_keys("This is a test task.")
        priority_select = self.driver.find_element(By.NAME, "priority")
        priority_select.send_keys("Medium")
        select = Select(priority_select)
        select.select_by_visible_text("Medium")
        self.driver.find_element(By.NAME, "dueDate").send_keys("2024-12-31")
        self.driver.find_element(By.NAME, "submit").click()
        task_cards = WebDriverWait(self.driver, 10).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, "h5.card-title[style*='color: black;']"))
        )
        task_titles = [task.text.strip() for task in task_cards]
        self.assertIn("Test Task", task_titles)

    def test_edit_task(self):
        # self.register_user()
        self.login_user()
        """Test case for editing a task."""
        self.test_add_task()  # Ensure a task exists before editing

        edit_button = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.NAME, "editTask"))
        )
        edit_button.click()
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.NAME, "title"))
        )
        self.driver.find_element(By.NAME, "title").clear()
        self.driver.find_element(By.NAME, "title").send_keys("Updated Task Title")
        self.driver.find_element(By.NAME, "description").clear()
        self.driver.find_element(By.NAME, "description").send_keys("Updated task description.")
        self.driver.find_element(By.NAME, "dueDate").send_keys("2024-12-31")
        self.driver.find_element(By.NAME, "submit").click()

        updated_tasks = WebDriverWait(self.driver, 10).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, "h5.card-title[style*='color: black;']"))
        )

        updated_task_titles = [task.text.strip() for task in updated_tasks]
        self.assertIn("Updated Task Title", updated_task_titles)

    def test_complete_task(self):
        # self.register_user()
        self.login_user()
        """Test case for marking a task as completed."""
        self.test_add_task()  # Ensure a task exists before marking as complete

        complete_button = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.NAME, "complete"))
        )
        complete_button.click()

        complete_button = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.NAME, "complete"))
        )
        icon = complete_button.find_element(By.TAG_NAME, "i")
        self.assertIn("green", icon.get_attribute("style"))

    def test_delete_task(self):
        # self.register_user()
        self.login_user()
        """Test case for deleting a task."""
        self.test_add_task()  # Ensure a task exists before deleting

        delete_button = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.NAME, "deleteTask"))
        )
        delete_button.click()

        deleted_task = WebDriverWait(self.driver, 10).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, "h5.card-title[style*='color: black;']"))
        )
        task_deleted = True
        for card in deleted_task:
            if "Updated Task Title" in card.text.strip():
                task_deleted = False
                break
        self.assertEqual(True, task_deleted)

    def tearDown(self):
        """Clear the database after each test case."""
        self.driver.delete_all_cookies()  # Clear browser cookies to ensure a fresh start

        time.sleep(5)

        # Attempt to log out if the user is still logged in
        try:
            logout_button = self.driver.find_element(By.NAME, "logout")  # Assume there is a logout button
            logout_button.click()
            WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.NAME, "login")))
        except:
            print("No active session to log out from")

        self.users.delete_many({})
        self.tasks.delete_many({})

        time.sleep(10)

        assert self.users.count_documents({}) == 0, "Users collection is not empty"
        assert self.tasks.count_documents({}) == 0, "Tasks collection is not empty"

        print("Database cleared after test case")

    @classmethod
    def tearDownClass(cls):
        """Close the browser after tests are done."""
        cls.driver.quit()
        cls.client.close()


if __name__ == "__main__":
    unittest.main()
