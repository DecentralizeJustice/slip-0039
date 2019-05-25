import os
import sys

module_dir = os.path.dirname(__file__)
sys.path.append(os.path.join(module_dir, '../code/'))
from slip39 import bits_to_bytes

print(bits_to_bytes(int(sys.argv[1])))
