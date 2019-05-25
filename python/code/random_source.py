import json

def random_bytes( par ):
   byte_string = b''
   entropy_pool = read_entropy()
   for x in range(0, par):
       used_entropy = read_used_entropy()
       update_used_entropy_count(used_entropy+1)
       int_byte =  entropy_pool[used_entropy]
       byte_string+=bytes([int_byte])
   return byte_string

def update_used_entropy_count(newCount):
    dict = {"count": newCount}
    with open('python/code/usedEntropy.json', 'w') as file:
        json.dump(dict, file)

def read_entropy():
    with open('framework/entropyPool.json', 'r') as file:
        data=file.read()
    obj = json.loads(data)
    return obj["entropy"]

def read_used_entropy():
    with open('python/code/usedEntropy.json', 'r') as file:
        data=file.read()
    obj = json.loads(data)
    return obj["count"]
