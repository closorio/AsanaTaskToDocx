import fs from "fs";
import fetch from "node-fetch";
import { getFullName, getDirname } from "./utils.js";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import path from "path";

// Configura las credenciales de la API de Asana

//Token de Acceso de Asana
const ASANA_ACCESS_TOKEN =
  " ";

//ID del Proyecto de Asana
const ASANA_PROJECT_ID = " ";

// Define la URL de la API de Asana para obtener las tareas dentro del proyecto específico
const asanaTaskUrl = `https://app.asana.com/api/1.0/projects/${ASANA_PROJECT_ID}/tasks?opt_fields=name,assignee.name,notes,attachments.gid, memberships.section.name`;

// Define las opciones para la llamada a la API de Asana
const options = {
  headers: {
    Authorization: `Bearer ${ASANA_ACCESS_TOKEN}`,
  },
};

// Lee el archivo de plantilla docx
const __dirname = getDirname(import.meta.url);
const content = fs.readFileSync(
  path.resolve(__dirname, "plantilla-dvTask.docx"),
  "binary"
);

// Crea un objeto para almacenar los datos que se utilizarán para reemplazar las variables en la plantilla
const data = {
  tasksBySection: {},
};

// Declara una variable para almacenar la cantidad de tareas generadas
let taskCount = 0;

// Realiza la llamada a la API de Asana y guarda la respuesta en un archivo de texto
fetch(asanaTaskUrl, options)
  .then((response) => response.json())
  .then(async (asanaData) => {
    // Crea un objeto para agrupar las tareas por sección
    const tasksBySection = {};

    // Itera sobre cada tarea en la respuesta y guarda su información en el objeto de secciones correspondiente
    for (let i = 0; i < asanaData.data.length; i++) {
      const task = asanaData.data[i];
      const sectionName = task.memberships[0].section.name;

      // Si la sección aún no existe en el objeto de secciones, créela.
      if (!tasksBySection[sectionName]) {
        tasksBySection[sectionName] = [];
      }

      // Extrae la información relevante de cada tarea de Asana y la almacena en variables
      const taskTitle = task.name;
      const taskAssignee = task.assignee
        ? getFullName(task.assignee.name)
        : "No asignado";
      const taskNotes = task.notes ? task.notes : "Sin notas";
      const taskAttachments =
        task.attachments && task.attachments.length > 0
          ? task.attachments
              .map(
                (attachment) =>
                  `https://app.asana.com/app/asana/-/get_asset?asset_id=${attachment.gid}`
              )
              .join("")
          : "Sin archivos adjuntos";

      const taskData = {
        title_: taskTitle,
        assignee_: taskAssignee,
        notes_: taskNotes,
        attachments_: taskAttachments,
        hl_: "\n___________________________________________________________________________________________________\n",
      };

      // Agrega la tarea al objeto de secciones correspondiente
      tasksBySection[sectionName].push(taskData);

      // Incrementa la cantidad de tareas generadas
      taskCount++;
    }

    // Itera sobre las secciones en el orden del array original y guarda todas las tareas de cada sección en un archivo .docx
    const sectionNames = Object.keys(tasksBySection);
    const dataDocx = {
      documentCreationDate_: new Date().toLocaleDateString(),
      projectId_: ASANA_PROJECT_ID,
      taskCount_: taskCount,
      sectionList: [],
    };

    // Crea el documento .docx con docxtemplater
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Itera sobre las secciones y agrega todas las tareas de cada sección en el objeto de datos
    for (let i = 0; i < sectionNames.length; i++) {
      const sectionName = sectionNames[i];
      const sectionTasks = tasksBySection[sectionName];

      dataDocx.sectionList.push({
        section_: sectionName,
        tasks_: sectionTasks,
      });
    }

    // Reemplazar las variables en la plantilla con los valores del objeto de datos
    doc.setData(dataDocx);

    // Reemplaza todas las variables en la plantilla con los valores correspondientes del objeto de datos y genera el documento final
    doc.render();

    // Genera el buffer del documento .docx y lo guarda en una variable
    const combinedBuffer = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    });

    // Escribe el buffer combinado en un archivo .docx
    fs.writeFileSync(
      path.resolve(__dirname, `Reporte AsanaTask-${ASANA_PROJECT_ID}.docx`),
      combinedBuffer
    );

    console.log(
      "-----¡Archivo Reporte AsanaTask.docx guardado con éxito!-----"
    );
  })
  .catch((error) => console.error(error));
