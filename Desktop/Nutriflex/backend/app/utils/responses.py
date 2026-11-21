def success(data=None, message='Success'):
    return {'status': 'success', 'message': message, 'data': data}

def error(message='Error', status_code=400):
    return {'status': 'error', 'message': message}, status_code
