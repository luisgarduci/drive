const {Auth, google} = require("googleapis");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const port = "8090";

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/")
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})

const server = express();

server.use(cors({
    origin: "*"
}))

server.listen(port, () => {
    console.log("Servidor Rodando");
})

server.get("/", (req, res) => {
    res.send("<h2>Rota raíz do servidor</h2>")
})

server.post("/upload", upload.single("image"), (req, res) => {
    const {folder_id} = req.body;
    console.log(req.file)
    Drive(req.file, folder_id); 
});


async function Drive(file, folder_id) {
    
    try {
        const auth = new Auth.GoogleAuth({
        keyFile: './credential.json', /* Your service credential file */
        scopes: 'https://www.googleapis.com/auth/drive'
         })
    
         const service = google.drive({
            version: 'v3',
            auth: auth
         })
    
         const media = {
            mimeType: file.mimeType,
            body: fs.createReadStream(file.path)
         }
    
         const response = await service.files.create({
           requestBody: {
            name: file.filename,
            parents: [folder_id]
           },
           media: media,
           fields: 'id'
         });
    
         return response.data.id
        
    }
        catch(err) {
           console.log(err)
        }
       
    }
    
    
    