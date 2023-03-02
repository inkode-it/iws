# Generated by Django 3.2.16 on 2022-11-29 08:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sea_storm_atlas', '0022_auto_20221128_0924'),
    ]

    operations = [
        migrations.CreateModel(
            name='SeaStormAtlasConfiguration',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('map', models.IntegerField(default=1)),
            ],
        ),
        migrations.AlterModelTable(
            name='stormeventeffectcomplete',
            table='sea_storm_atlas_effect_complete',
        ),
    ]
