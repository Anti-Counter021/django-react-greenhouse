# Generated by Django 3.2.4 on 2021-07-08 16:38

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='features_product',
            field=models.ManyToManyField(blank=True, related_name='featrues_for_product', to='shop.ProductFeature', verbose_name='Характеристики'),
        ),
        migrations.AlterField(
            model_name='order',
            name='order_date',
            field=models.DateField(db_index=True, default=datetime.datetime(2021, 7, 8, 16, 38, 18, 711951), verbose_name='Дата для получения заказа'),
        ),
    ]
