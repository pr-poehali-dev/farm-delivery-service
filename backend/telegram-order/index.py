import json
import os
import urllib.request
from typing import Dict, Any

HEADERS = {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''Отправляет заказ оператору в Telegram через бота'''
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
        return {'statusCode': 405, 'headers': HEADERS, 'body': json.dumps({'error': 'Method not allowed'})}

    body = json.loads(event.get('body') or '{}')
    message = body.get('message', '').strip()
    if not message:
        return {'statusCode': 400, 'headers': HEADERS, 'body': json.dumps({'error': 'message is required'})}

    token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    if not token or not chat_id:
        return {'statusCode': 500, 'headers': HEADERS, 'body': json.dumps({'success': False, 'error': 'Telegram not configured'})}

    payload = json.dumps({'chat_id': chat_id, 'text': message}).encode('utf-8')
    req = urllib.request.Request(
        f'https://api.telegram.org/bot{token}/sendMessage',
        data=payload,
        headers={'Content-Type': 'application/json'}
    )
    try:
        with urllib.request.urlopen(req, timeout=4) as resp:
            result = json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        print(f'Telegram ERROR: {type(e).__name__}')
        return {'statusCode': 502, 'headers': HEADERS, 'body': json.dumps({'success': False})}

    return {'statusCode': 200, 'headers': HEADERS, 'body': json.dumps({'success': bool(result.get('ok'))})}
