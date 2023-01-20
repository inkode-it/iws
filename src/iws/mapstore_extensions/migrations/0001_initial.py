# Generated by Django 3.2.16 on 2023-01-20 12:02

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('maps', '0042_remove_maplayer_styles'),
    ]

    operations = [
        migrations.CreateModel(
            name='MapstoreExtension',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=250, unique=True)),
                ('enabled', models.BooleanField(default=False)),
                ('resources', models.ManyToManyField(blank=True, to='maps.Map')),
            ],
        ),
    ]
