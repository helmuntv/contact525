# Proyecto de Contactos

Este es un proyecto de ejemplo que muestra cómo crear una aplicación de administración de contactos utilizando Django y Django Rest Framework.

## Instalación

Sigue estos pasos para configurar y ejecutar el proyecto en tu máquina local.

### Requisitos previos

Asegúrate de tener instalados los siguientes componentes en tu máquina:

- Python (versión 3.10 recomendada)
- pip (el gestor de paquetes de Python)
- MySQL (u otro sistema de gestión de bases de datos compatible)

### Clonar el repositorio

```bash
git clone https://github.com/helmuntv/contact525.git
cd contact
```
### Configuración del entorno virtual

Se recomienda utilizar un entorno virtual para aislar las dependencias del proyecto. Puedes crear uno con virtualenv:

```bash
python -m venv venv
```
Luego, activa el entorno virtual:

En Windows:
```bash
venv\Scripts\activate
```

En macOS y Linux:
```bash
source venv/bin/activate
```

### Instalar dependencias

Dentro del entorno virtual, utiliza pip para instalar las dependencias del proyecto:

```bash
pip install -r requirements.txt
```

Configurar la base de datos

- Crea una base de datos MySQL vacía con el nombre contacts.
- Copia el archivo .env.example y renómbralo a .env. Ajusta las variables de entorno, incluyendo la configuración de tu base de datos:

```bash
DB_NAME=contacts
DB_USER=usuario_de_mysql
DB_PASSWORD=contraseña_de_mysql
DB_HOST=localhost
DB_PORT=3306
```
- Aplica las migraciones para crear las tablas en la base de datos:

```bash
python manage.py migrate
```
### Ejecutar el servidor

Inicia el servidor de desarrollo de Django:

```bash
python manage.py runserver
```
La aplicación estará disponible en http://localhost:8000/


### Documentación

Mira la documentación de las APIS disponibles en http://localhost:8000/swagger/