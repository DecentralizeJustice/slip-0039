import os
import sys

module_dir = os.path.dirname(__file__)
sys.path.append(os.path.join(module_dir, '../code/'))
from slip39 import _generate_random_identifier

print(_generate_random_identifier())
