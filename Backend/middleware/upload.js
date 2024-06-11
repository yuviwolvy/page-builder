import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "uploads/");
    },
    filename: function(req, file, cb){
        let ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function(req, file, callback){
        if(
            file.mimetype == "image/jpeg" ||
            file.mimetype == "image/png" ||
            file.mimetype == "application/pdf" ||
            file.mimetype == "application/vnd.ms-excel" ||
            file.mimetype == "application/msword" ||
            file.mimetype == "application/mspowerpoint"
        ){
            callback(null, true);
        } else{
            console.log("File type not supported");
            callback(null, false);
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 20
    }
});

export default upload;