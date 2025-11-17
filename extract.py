import json
degrees = {
    "d": []

}



with open('uh.json', 'r') as f:
    data = json.load(f)

    for key in data:
        degrees['d'].append(key["program_name"])

with open('degrees.json', "w") as g:
    json.dump(degrees, g, indent=4)