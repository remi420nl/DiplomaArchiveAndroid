import json
from web3 import Web3, HTTPProvider
import sys
import os
from rest_framework.response import Response

blockchain_address = 'http://127.0.0.1:8545'
web3 = Web3(HTTPProvider(blockchain_address))


def get_smartcontract():

   #  getting the first available account from the genache blockchain
    web3.eth.defaultAccount = web3.eth.accounts[0]

    a = os.path.split(os.getcwd())[0]

    compiled_contract_path = a + \
        '/diplomaarchive/blockchain/build/contracts/Exemptions.json'

    deployed_contract_address = '0x95Db0063722C274c84cf2e5E643aC26E680680b3'

    with open(compiled_contract_path) as file:
        contract_json = json.load(file)  # load contract info as JSON

        deployed_adress = contract_json['networks']['1613987460244']['address']

        contract_abi = contract_json['abi']

    # get copy of contract
    contract = web3.eth.contract(
        address=deployed_adress, abi=contract_abi)

    return contract


def get_studentexemptions_from_blockchain(student_id):

    contract = get_smartcontract()

    exemptions = []

    exemptions = contract.functions.fromStudent(student_id).call()
    return exemptions


def add_exemption_blockchain(student, course):

    contract = get_smartcontract()
    print(contract)

    tx_hash = contract.functions.createExemption(
        student['name'], course['name'], student['id']).transact()
    tx_receipt = web3.eth.waitForTransactionReceipt(tx_hash)
    print('tx_hash: {}'.format(tx_hash.hex()))

    return tx_hash.hex()
