import os
import sys

module_dir = os.path.dirname(__file__)
sys.path.append(os.path.join(module_dir, '../code/'))
from slip39 import word_index

print(word_index(sys.argv[1]))
