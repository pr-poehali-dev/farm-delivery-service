import json
import os
import urllib.request
import urllib.parse

def handler(event, context):
    '''Проверяет API ключ SMS.ru и баланс'''
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'}, 'body': ''}

    api_key = os.environ.get('SMSRU_API_KEY')
    
    params = urllib.parse.urlencode({'api_id': api_key, 'json': 1})
    url = f'https://sms.ru/auth/check?{params}'
    
    with urllib.request.urlopen(url) as resp:
        auth_result = json.loads(resp.read().decode('utf-8'))

    params2 = urllib.parse.urlencode({'api_id': api_key, 'json': 1})
    url2 = f'https://sms.ru/my/balance?{params2}'
    
    with urllib.request.urlopen(url2) as resp2:
        balance_result = json.loads(resp2.read().decode('utf-8'))

    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'auth': auth_result, 'balance': balance_result})
    }
