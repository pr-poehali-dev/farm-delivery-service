import json
import os
import urllib.request
import urllib.parse
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Отправляет SMS оператору через SMS.ru при оформлении заказа
    '''
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    if event.get('httpMethod') != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }

    body_data = json.loads(event.get('body', '{}'))
    to = body_data.get('to', '')
    message = body_data.get('message', '')

    if not to or not message:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'to and message are required'})
        }

    api_key = os.environ.get('SMSRU_API_KEY')

    params = urllib.parse.urlencode({
        'api_id': api_key,
        'to': to,
        'msg': message,
        'json': 1
    })

    url = f'https://sms.ru/sms/send?{params}'
    req = urllib.request.Request(url)

    print(f"Sending SMS to: {to}, url: {url[:80]}...")

    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode('utf-8'))
        print(f"SMS.ru response: {result}")
    except Exception as e:
        print(f"SMS.ru ERROR: {type(e).__name__}: {e}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': False, 'error': str(e)})
        }

    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'result': result})
    }