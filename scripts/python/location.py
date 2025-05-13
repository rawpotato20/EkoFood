import json

# Load the JSON data from the file
with open('/Users/sc0rp10n/MyStuff/freelancing/eko-maistas/python/locations.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Filter the data to keep only entries with "A0_NAME": "LT"
filtered_data = [item for item in data if item.get("A0_NAME") == "LT"]

# Save the filtered data to a new JSON file with UTF-8 characters
with open('filtered_locations.json', 'w', encoding='utf-8') as outfile:
    json.dump(filtered_data, outfile, ensure_ascii=False, indent=4)

print("Filtered data has been saved to filtered_locations.json")
