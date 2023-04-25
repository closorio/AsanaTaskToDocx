# Asana Task To Docx

Manual de Usuario

- Creado por: Cristian L. Osorio <[closorio](https://github.com/closorio)>

# Introducción

Bienvenido al manual de usuario de la aplicación de generación de informes AsanaTask. Esta aplicación utiliza la API de Asana para generar informes de tareas en un proyecto específico y las exporta a un archivo de Microsoft Word en formato .docx. Este manual le guiará a través del proceso de instalación y uso de la aplicación AsanaTaskToDocx.

Para utilizar esta aplicación, debe tener una **cuenta en Asana** y tener **acceso a un proyecto específico** en el que desea generar informes de tareas. Además, se requiere una conexión a Internet activa y un entorno de desarrollo de Javascript en Node js.

El archivo de la aplicación AsanaTask consta de varias secciones que se encargan de la lectura de los datos del proyecto de Asana, la agrupación de las tareas por sección y la generación de un archivo de Microsoft Word que contiene un informe de las tareas. La aplicación utiliza varias bibliotecas de JavaScript, incluyendo fetch, fs y path, para interactuar con la API de Asana y crear el archivo de Microsoft Word.

Este manual le proporcionará instrucciones detalladas sobre cómo instalar y usar la aplicación AsanaTaskToDocx, incluyendo cómo configurar sus credenciales de API de Asana y cómo ejecutar la aplicación para generar un informe de tareas.

👷 Manos a la obra!

# 1. Instalación del entorno de desarrollo

Como bien se explica en la introducción, para utilizar esta aplicación se requiere 3  partes esenciales para su despliegue:

1. **Tener instalado cualquiera de la versiones de Node.js 12.x o superor.**
    
    Para instalar Node.js en Linux, puedes seguir estos pasos:
    
    - Abre una terminal en tu distribución Linux.
    - Actualiza tu sistema con el siguiente comando:
    
    ```jsx
    sudo apt update
    ```
    
    - Instala curl si aún no lo tienes en tu sistema:
    
    ```jsx
    sudo apt install curl
    ```
    
    - Descarga el instalador de Node.js desde el sitio web oficial de Node.js:
    
    ```jsx
    curl -sL https://deb.nodesource.com/setup_{version}.x | sudo -E bash -
    ```
    
     *Asegúrese de reemplazar **`{version}`**con la versión de Node.js que desea instalar (por ejemplo, 12 para la versión 12.x).*
    
    - Instale Node.js escribiendo el siguiente comando:
    
    ```jsx
    sudo apt-get install nodejs
    ```
    
    - Para verificar si la instalación se realizó correctamente, escriba el siguiente comando para verificar la versión de Node.js:
    
    ```jsx
    node -v
    ```
    

1. **Se recomienda el uso de Visual Studio Code para la ejecución e instalación por medio de su terminal.**

1. **Contar con los archivos del proyecto, o clonar el repositorio en el directorio elegido.**
    
    Para clonar un repositorio de GitHub utilizando Git en Linux, sigue estos pasos:
    
    - Abre una terminal en tu distribución de Linux.
    - Navega hasta la carpeta donde deseas clonar el repositorio.
    - Clona el repositorio escribiendo el siguiente comando:

```jsx
git clone https://github.com/closorio/AsanaTaskToDocx.git
```

1. **Una vez realizado todo lo anterior, lo siguiente será instalar las dependencias necesarias para ejecutar el script de node.**
    
    Para instalar las dependencias necesarias desde Visual Studio Code, sigue los siguientes pasos:
    
    - Abre Visual Studio Code y abre la carpeta que contiene el proyecto.
    - Abre la terminal de Visual Studio Code haciendo clic en "Terminal" en la barra de menú superior y seleccionando "New Terminal" o presionando **`Ctrl+Shift+ñ`**
    - Asegúrate de que tienes el archivo **`package.json`** en la raíz de del proyecto. Este archivo debe contener una lista de las dependencias del proyecto.
    - Instala las dependencias de tu proyecto ejecutando el siguiente comando:
    
    ```jsx
    npm install
    ```
    
    - Este comando instalará todas las dependencias listadas en tu archivo **`package.json`**
     y las guardará en una carpeta **`node_modules`**en la raíz del proyecto.

# 2. Configuración de la apliación

Es necesario proporcionar los parámetros de entrada: La aplicación utiliza dos parámetros de entrada: **"ASANA_ACCESS_TOKEN"** y **"ASANA_PROJECT_ID"**. El token de acceso se utiliza para autenticar la llamada a la API de Asana y el ID del proyecto se utiliza para especificar el proyecto del que se desean obtener las tareas.

**2.1 Para generar un token de acceso de Asana, siga los siguientes pasos:**

- Inicie sesión en su cuenta de Asana.
- Haga clic en su foto de perfil en la esquina superior derecha de la página y seleccione "Mi perfil y configuración".
- En la pestaña "Aplicaciones", desplácese hacia abajo hasta "Tokens de acceso" y haga clic en "Administrar tokens de acceso".
- Haga clic en "Crear nuevo token de acceso" y asigne un nombre descriptivo al token.
- Seleccione los permisos que desea asignar al token. Los permisos disponibles incluyen acceso completo a la cuenta de Asana, acceso a proyectos y tareas específicas, y la capacidad de crear y modificar proyectos.
- Haga clic en "Crear token de acceso" para generar el token.
- Copie el token generado y guárdelo en un lugar seguro. Tendrá que usar este token para autenticar cualquier solicitud que haga a la API de Asana.
- Copie el token generado en el código entre las comillas dobles (” ”) según la imagen a continuación:

![Untitled](Asana%20Task%20To%20Docx%2004c0987cbe2c44789cd61bf4a7baa054/Untitled.png)

<aside>
💡 Nota: Es importante tener en cuenta que los tokens de acceso tienen acceso a la información y acciones de la cuenta de Asana, así que asegúrese de mantener el token seguro y de revocar cualquier token que ya no necesite.

</aside>

**2.2 Para obtener el ID de un proyecto de Asana, sigue estos pasos:**

- Inicia sesión en tu cuenta de Asana.
- Abre el proyecto cuyo ID deseas obtener.
- En la barra de direcciones de tu navegador, busca el número que aparece después de "**[https://app.asana.com/0/](https://app.asana.com/0/)**" en la URL. Ese número es el ID del proyecto.
- También puedes encontrar el ID del proyecto en la URL del enlace "Exportar" del proyecto. El ID del proyecto estará en la parte final de la URL después de "projectID=".
- Copie el ID del proyecto en el código justo después del Token de acceso de Asana, entre las comillas dobles (” ”), como se muestra en la siguiente imagen

![Untitled](Asana%20Task%20To%20Docx%2004c0987cbe2c44789cd61bf4a7baa054/Untitled%201.png)

<aside>
💡 Nota: Es necesario tener en cuenta que el ID del proyecto es único y no se puede cambiar una vez que se ha creado el proyecto en Asana .

</aside>

> **Importante: Deberá repetirse el paso anterior cada vez que se quiera generar un reporte de un proyecto distinto con su respectivo ID**
> 

# 3. Ejecución de la apliación

Perfecto! Ahora estás listo para ejecutar el script en Node.js. Puedes ejecutarlo desde la terminal de Visual Studio Code utilizando el comando **`node`** seguido del nombre del archivo:

```jsx
node attd-notes.js
```

# 4. Configuración del archivo .docx

Una vez generado el Reporte Asana.docx, estará disponible para su modificación y organización

- Es necesario **modificar el nombre del proyecto** marcado como [NOMBRE DE PROYECTO] en la primera hoja de la portada con su respectivo nombre, además de **actualizar el índice** para que se complete automáticamente con el listado de las secciones y títulos asignados a cada una de las tareas.
- Una vez realizadas las modificaciones pertinentes al documento, podemos pasar a exportar el documento como formato PDF.

<aside>
💡 Nota: Se recomienda que al momento de abrir el documento PDF, utilize cualquiera de los navegadores web para esta tarea, ya que al abrir el archivo PDF en un navegador web, se utiliza el complemento del navegador para interpretar los enlaces del PDF dando la posibilidad de abrir enlaces a una página web o saltar a una página específica dentro del mismo PDF.

</aside>