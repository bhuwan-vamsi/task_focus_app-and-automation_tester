import os
import csv


# Log errors to a CSV file
def log_error(test_name, error_message):
    log_file = "logs/error_log.csv"
    os.makedirs(os.path.dirname(log_file), exist_ok=True)
    with open(log_file, mode="a", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([test_name, error_message])


# Log successful tests to a CSV file
def log_success(test_name, message="Test passed"):
    success_log_file = "logs/success_log.csv"
    os.makedirs(os.path.dirname(success_log_file), exist_ok=True)
    with open(success_log_file, mode="a", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([test_name, message])


# Capture screenshots for debugging
def capture_screenshot(driver, test_name):
    screenshot_path = f"logs/screenshots/{test_name}.png"
    os.makedirs(os.path.dirname(screenshot_path), exist_ok=True)
    driver.save_screenshot(screenshot_path)


# Load test data from a CSV file
def load_csv_data(file_path):
    try:
        with open(file_path, mode="r") as file:
            reader = csv.DictReader(file)
            return list(reader)
    except FileNotFoundError:
        raise Exception(f"Test data file {file_path} not found.")
