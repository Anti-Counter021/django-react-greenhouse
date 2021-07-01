# Generated by Django 3.2.4 on 2021-06-30 13:39

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0004_auto_20210630_1338'),
    ]

    operations = [
        migrations.AlterField(
            model_name='feedback',
            name='status',
            field=models.CharField(choices=[('new', 'Новый'), ('fix', 'Исправлен')], default='new', max_length=30, verbose_name='Статус ошибки'),
        ),
        migrations.AlterField(
            model_name='order',
            name='order_date',
            field=models.DateField(db_index=True, default=datetime.datetime(2021, 6, 30, 13, 39, 43, 265719), verbose_name='Дата для получения заказа'),
        ),
    ]