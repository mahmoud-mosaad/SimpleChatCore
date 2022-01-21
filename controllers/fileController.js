
exports.fileUpload = async function (req, res){
	
    var _photos = []
    var _files = []

    req.files.map(function(file) {

        if (file.mimetype != '' && file.mimetype.split('/')[0] == 'image'){
            _photos.push(
                {
                    id: 'p_' + (Math.random() + 1).toString(36).substring(7),
                    name: file.originalname,
                    src: 'chat/' + file.filename,
                }
            )
        }
        else{
            _files.push(
                {
                    id: 'f_' + (Math.random() + 1).toString(36).substring(7),
                    name: file.originalname,
                    size: file.size,
                    link: 'chat/' + file.filename,
                }
            )
        }
    })

    res.json({
        photos: _photos,
        files: _files
    })

    res.end()

};
