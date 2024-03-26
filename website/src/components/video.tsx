import './video.css'; // Assuming you have a Video.css file for styling

// Ajout d'un prop `src` pour le composant Video
function Video({ src } : any) {
    return (
        <div className="video-container">
            <video autoPlay muted loop src={src} style={
                {
                    borderRadius: "10px",
                }
            }/>
        </div>
    );
}

export default Video;