def success(data=None, message='Success'):
    return {'status': 'success', 'message': message, 'data': data}, 200

def error(message='Error', status_code=400):
    return {'status': 'error', 'message': message}, status_code
