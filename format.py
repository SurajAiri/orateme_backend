import json

def read_json(path):
    with open(path, 'r') as file:
        data = json.load(file)
    return data

data = read_json('res1.json')

d2 = data['results']['channels'][0]['alternatives'][0]

# print(d1)

# d2 = d1
print(d2)

# print(d2['transcript'])

para = d2['paragraphs']['paragraphs']

# print("This is the transcript in sentence level: in format\nstart - end : sentence")
for i in para:
    sents = i['sentences']

    for j in sents:
        print(f"{j['start']:.2f} - {j['end']:.2f} : {j['text']}")
print("\n")
print("Below given are low confidence words during transcription it might be because of transcriber or speaker.\nIt is in the format word confidence.")
for i in d2['words']:
    if i['confidence'] < 0.9:
        # print(f"{i['start']:.2f} {i['end']:.2f} {i['word']} {i['confidence']:.2f}")
        print(f"{i['word']} {i['confidence']:.2f}", end=", ")

# paragraph -> [sentences]
# [words]