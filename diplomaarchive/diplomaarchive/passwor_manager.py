from django.contrib.auth.hashers import BasePasswordHasher
from collections import OrderedDict

def is_password_hashed(encoded):
    print(endcoded)
    return True

class BudgetHasher(BasePasswordHasher):
    algorythm = 'Budget'

    def verify(self, password,encoded):
        return encoded == self.encode(password)

    def encode(self,password, salt=None):
        return password + 'secure'

    def safe_summary(self, encoded):
        return OrderedDict([
            (_('algorithm'), "Budget"),
            (_('iterations'), "At least 1"),
            (_('salt'), "No salt"),
            (_('hash'), "No hash"),
            ])

