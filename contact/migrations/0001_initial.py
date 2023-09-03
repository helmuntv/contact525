# Generated by Django 4.2.4 on 2023-09-01 03:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('utils', '0002_gendertype'),
    ]

    operations = [
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('birthdate', models.DateField()),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254)),
                ('address', models.TextField()),
                ('housing_type', models.CharField(max_length=50)),
                ('comment', models.TextField()),
                ('active', models.BooleanField(default=True)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('updated_date', models.DateTimeField(auto_now=True)),
                ('city', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='utils.city')),
                ('country', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='utils.country')),
                ('gender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='utils.gendertype')),
                ('state', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='utils.state')),
            ],
            options={
                'db_table': 'contacts',
            },
        ),
    ]