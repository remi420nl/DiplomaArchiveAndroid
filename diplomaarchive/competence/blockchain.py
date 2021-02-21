import json
from web3 import Web3, HTTPProvider
import sys
import os
from rest_framework.response import Response

blockchain_address = 'http://127.0.0.1:7545'
web3 = Web3(HTTPProvider(blockchain_address))


def get_smartcontract():

   #  getting the first available account from the genache blockchain
    web3.eth.defaultAccount = web3.eth.accounts[0]

    a = os.path.split(os.getcwd())[0]

    compiled_contract_path = a + \
        '/diplomaarchive/blockchain/build/contracts/Exemptions.json'

    deployed_contract_address = '0xb31b0bB83d98A325e66ceA66825160F8DC54C846'

    with open(compiled_contract_path) as file:
        contract_json = json.load(file)  # load contract info as JSON

        address_test = contract_json['networks']['5777']['address']

        contract_abi = contract_json['abi']

    # get copy of contract
    contract = web3.eth.contract(
        address=address_test, abi=contract_abi)

    return contract


def get_studentexemptions_from_blockchain(student_id):

    contract = get_smartcontract()

    exemptions = []

    exemptions = contract.functions.fromStudent(4).call()
    print(exemptions)
    return exemptions


def add_exemption_blockchain(student, course):

    contract = get_smartcontract()

    tx_hash = contract.functions.createExemption(
        student['name'], course['name'], student['id']).transact()
    tx_receipt = web3.eth.waitForTransactionReceipt(tx_hash)
    print('tx_hash: {}'.format(tx_hash.hex()))

    return tx_hash.hex()
