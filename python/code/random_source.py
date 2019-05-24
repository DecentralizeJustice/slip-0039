import json

def random_bytes( par ):
   bytes = b''
   for x in range(0, par):
       bytes+=b'\x02'
   return bytes
