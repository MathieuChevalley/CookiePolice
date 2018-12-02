from flask import Flask, request
import json
import jsonify

app = Flask(__name__)

@app.route('/get-categories', methods=['GET'])
def getCategories():
    with open('categories.json') as file:
        data = json.load(file)
    return json.dumps(data)

@app.route('/get-trackers', methods=['GET'])
def getTrackers():
    with open('trackerList.json') as file:
        data = json.load(file)
    return json.dumps(data)

@app.route('/get-database', methods=['GET'])
def getDatabase():
    with open('database.json') as file:
        data = json.load(file)
    return json.dumps(data)

@app.route('/update-database', methods=['POST'])
def setDatabase():
    if request.method == 'POST':
        data = request.json
        toSave = json.dumps(data)
        if ("score" in toSave):
            if ("category" in toSave):
                with open("database.json", "w") as file:
                    file.write(toSave)
                    return 'Database updated'
                    print("Database updated")
    return 'Update failed'

@app.route('/update-categories', methods=['POST'])
def setCategories():
    if request.method == 'POST':
        data = request.json
        toSave = json.dumps(data)
        if ("category" in toSave):
            with open("categories.json", "w") as file:
                file.write(toSave)
                return 'Categories updated'
                print("Categories updated")
    return 'Update failed'

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True, port=80)
