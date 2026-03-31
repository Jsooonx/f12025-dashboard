from flask import Flask, render_template, jsonify
import requests

app = Flask(__name__)

BASE_URL = "https://api.jolpi.ca/ergast/f1/2025"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/standings")
def standings():
    res = requests.get(f"{BASE_URL}/driverStandings/")
    data = res.json()
    drivers = data["MRData"]["StandingsTable"]["StandingsLists"][0]["DriverStandings"]
    return jsonify(drivers)

@app.route("/api/schedule")
def schedule():
    res = requests.get(f"{BASE_URL}/races/")
    data = res.json()
    races = data["MRData"]["RaceTable"]["Races"]
    return jsonify(races)

@app.route("/api/constructors")
def constructors():
    res = requests.get(f"{BASE_URL}/constructorStandings/")
    data = res.json()
    constructors = data["MRData"]["StandingsTable"]["StandingsLists"][0]["ConstructorStandings"]
    return jsonify(constructors)

@app.route("/api/lastrace")
def lastrace():
    res = requests.get(f"{BASE_URL}/last/results/")
    data = res.json()
    race = data["MRData"]["RaceTable"]["Races"][0]
    return jsonify(race)

if __name__ == "__main__":
    app.run(debug=True)