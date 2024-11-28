import os


def main():
    # print("Running Database Tests...")
    # os.system("python -m unittest database_testing/test_database.py")

    print("Running Frontend Tests...")
    os.system("python -m unittest frontend_testing/test_frontend.py")

    # print("Running API Tests...")
    # os.system("python -m unittest api_testing/test_api.py")


if __name__ == "__main__":
    main()
