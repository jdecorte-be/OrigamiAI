import './schema.css'; // Assuming you have a Schema.css file for styling

// Ajout d'un prop `src` pour le composant Schema
function Schema({ src } : any) {
    return (
        <div className="schema-container">
            <img src={src} alt="Schema" />
        </div>
    );
}

export default Schema;