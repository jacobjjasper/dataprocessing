import csv
import json

jsonfile = open('2016_happiness_westerneurope.json', 'w')

with open('2016_happiness_westerneurope.csv', 'r') as csv_file:
    csv_reader = csv.DictReader(csv_file, delimiter=",")

    jsonfile.write("{ \"data\": [")
    jsonfile.write("\n")

    for line in csv_reader:
        s = json.dumps(line)
        jsonfile.write(s)
        jsonfile.write(",")
        jsonfile.write("\n")

    jsonfile.write("]")
jsonfile.close()
