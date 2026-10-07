import json
import os
import smtplib
from email.mime.text import MIMEText
from email.header import Header
from typing import Dict, Any

HEADERS = {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
RECIPIENT = 'kate2010vl.borodina@yandex.ru'


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''Отправляет заказ с сайта письмом на электронную почту оператора'''
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

    user = os.environ.get('SMTP_USER')
    password = os.environ.get('SMTP_PASSWORD')
    if not user or not password:
        return {'statusCode': 500, 'headers': HEADERS, 'body': json.dumps({'success': False, 'error': 'Mail not configured'})}

    host = os.environ.get('SMTP_HOST', 'smtp.yandex.ru')
    port = int(os.environ.get('SMTP_PORT', '465'))

    msg = MIMEText(message, 'plain', 'utf-8')
    msg['Subject'] = Header('Новый заказ с сайта', 'utf-8')
    msg['From'] = user
    msg['To'] = RECIPIENT

    try:
        with smtplib.SMTP_SSL(host, port, timeout=4) as server:
            server.login(user, password)
            server.sendmail(user, [RECIPIENT], msg.as_string())
    except Exception as e:
        print(f'Mail ERROR: {type(e).__name__}: {e}')
        return {'statusCode': 502, 'headers': HEADERS, 'body': json.dumps({'success': False, 'error': type(e).__name__})}

    return {'statusCode': 200, 'headers': HEADERS, 'body': json.dumps({'success': True})}
