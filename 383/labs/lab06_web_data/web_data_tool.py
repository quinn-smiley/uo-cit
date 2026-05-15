import requests
from bs4 import BeautifulSoup
import sqlite3


DB_NAME = "web_data.db"


def setup_database():
    """Create the database tables if they do not already exist."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS quotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT,
        author TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS api_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        predicted_age INTEGER,
        count INTEGER
    )
    """)

    conn.commit()
    conn.close()


def save_quote(text, author):
    """Save one quote and author to the database."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO quotes (text, author) VALUES (?, ?)",
        (text, author)
    )

    conn.commit()
    conn.close()


def save_api_result(name, predicted_age, count):
    """Save one API result to the database."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO api_results (name, predicted_age, count) VALUES (?, ?, ?)",
        (name, predicted_age, count)
    )

    conn.commit()
    conn.close()


def scrape_quotes():
    """Scrape quotes from a practice website."""
    url = "https://quotes.toscrape.com"
    response = requests.get(url)

    soup = BeautifulSoup(response.text, "html.parser")
    quote_blocks = soup.find_all("div", class_="quote")

    for block in quote_blocks[:5]:
        text = block.find("span", class_="text").text
        author = block.find("small", class_="author").text

        print(f"{text} — {author}")
        save_quote(text, author)


def call_api(name):
    """Call a public API and save the result."""
    url = f"https://api.agify.io/?name={name}"
    response = requests.get(url)
    data = response.json()

    print(data)

    save_api_result(
        data.get("name"),
        data.get("age"),
        data.get("count")
    )


def show_saved_data():
    """Display saved database records."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    print("\nSaved Quotes:")
    cursor.execute("SELECT text, author FROM quotes")
    for row in cursor.fetchall():
        print(row)

    print("\nSaved API Results:")
    cursor.execute("SELECT name, predicted_age, count FROM api_results")
    for row in cursor.fetchall():
        print(row)

    conn.close()


def main():
    setup_database()

    print("Scraping quotes...")
    scrape_quotes()

    # --- UPDATED SECTION START ---
    print("\n--- API Name Lookup ---")
    user_name = input("Enter a name to predict age for: ").strip()

    # Basic logic check: Ensure the name isn't just a number
    if user_name:
        if user_name.isdigit():
            print("Error: Please enter a name (text), not just numbers.")
        else:
            print(f"Calling API for: {user_name}...")
            call_api(user_name)
    else:
        print("No name entered. Skipping API call.")

    print("\nShowing saved data...")
    show_saved_data()


if __name__ == "__main__":
    main()