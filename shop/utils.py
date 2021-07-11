from datetime import datetime

import os


def get_timestamp_path(instance, filename):
    """ Переименование файлов в один формат """

    return f'{datetime.utcnow().timestamp()}{os.path.splitext(filename)[1]}'
