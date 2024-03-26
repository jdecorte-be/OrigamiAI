// step.js
import Schema from './schema';
import Chat from './chat';
import Video from './video';
import './step.css';

function Step({ i } : any) {
    const videoSources = ["src/assets/video/vid1.mov", "src/assets/video/vid2.mov", "src/assets/video/vid3.mov", "src/assets/video/vid4.mov", "src/assets/video/vid5.mov", "src/assets/video/vid6.mov", "src/assets/video/vid7.mov", "src/assets/video/vid8.mov", "src/assets/video/vid9.mov", "src/assets/video/vid10.mov", "src/assets/video/vid11.mov", "src/assets/video/vid12.mov", "src/assets/video/vid13.mov", "src/assets/video/vid14.mov"];
    const schemaSources = ["src/assets/schema/step1.png", "src/assets/schema/step2.png", "src/assets/schema/step3.png", "src/assets/schema/step4.png", "src/assets/schema/step5.png", "src/assets/schema/step6.png", "src/assets/schema/step7.png", "src/assets/schema/step8.png", "src/assets/schema/step9.png", "src/assets/schema/step10.png", "src/assets/schema/step11.png", "src/assets/schema/step12.png", "src/assets/schema/step13.png", "src/assets/schema/step14.png"];


    return (
        <div className="step-container">
            <Video src={videoSources[i]} />
            <Schema src={schemaSources[i]} />
            <Chat messages={messages}/>
        </div>
    );
}

export default Step;
