document.addEventListener('DOMContentLoaded', () => {

    const btnCamara = document.getElementById('activar-camara');

    btnCamara.addEventListener('click', () => {
        const video_registro = document.getElementById('video-registro');
        video_registro.classList.remove('hidden');
        btnCamara.remove();
        iniciar_video();
    });

})


function iniciar_video(){
    const video_registro = document.getElementById('video-registro');
    const canvas_registro = document.getElementById('canvas-registro');

    navigator.getMedia = ( navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia);

    if(navigator.getUserMedia){

        navigator.getMedia({video: true}, (stream) => {
            video_registro.srcObject = stream;
            video_registro.play();
            }
        , (err) => {
            console.log(err);
        }
        )
        
        const form = document.getElementById('form');
        form.addEventListener('submit', async(e) => {
            e.preventDefault();

            canvas_registro.width = video_registro.videoWidth;
            canvas_registro.height = video_registro.videoHeight;

            canvas_registro.getContext('2d').drawImage(video_registro, 0, 0, canvas_registro.width, canvas_registro.height);

            const img_data = canvas_registro.toDataURL('image/jpeg');
            const img_blob = dataURItoBlob(img_data);

        
            const nombre_usuario = document.getElementById('nombre-usuario').value;

            let formData = new FormData();
            formData.append('name', nombre_usuario);
            formData.append('image', img_blob);

            try{
                const response = await axios.post('http://localhost:3000/', formData);
                alert(response.data.msg);
            }catch(error){
                console.log(error);
            }

        })

    }
    
}


function dataURItoBlob(dataURI)
{
    var byteString = atob(dataURI.split(',')[1]);

    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++)
    {
        ia[i] = byteString.charCodeAt(i);
    }

    var bb = new Blob([ab], { "type": mimeString });
    return bb;
}