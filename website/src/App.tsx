import React, { useState } from "react";
import "./App.css";
import Chat from "./components/chat";
import { useCallback, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { css } from "@emotion/css";
import { Camera } from "@mediapipe/camera_utils";
import { Hands, Results } from "@mediapipe/hands";
import { drawCanvas } from "./utils/drawCanvas";
import Step from "./components/step";
import Video from "./components/video";
import Schema from "./components/schema";
// import css
import "./App.css";
import "./components/chat.css";
import "./components/schema.css";

function isThumbUp(landmarks: any) {
  // Vérification pour chaque doigt spécifique (index, majeur, annulaire, auriculaire)
  let thumbCmc = landmarks[1]; // Carpo-Métacarpienne (CMC) du pouce
  let thumbMcp = landmarks[2]; // Métacarpo-Phalangienne (MCP) du pouce
  let thumbIp = landmarks[3]; // Interphalangienne (IP) du pouce
  let thumbTip = landmarks[4]; // Bout du pouce

  // Landmarks des autres doigts
  let indexFingerMcp = landmarks[5];
  let middleFingerMcp = landmarks[9];
  let ringFingerMcp = landmarks[13];
  let pinkyMcp = landmarks[17];

  // Bout des doigts pour vérifier s'ils sont pliés
  let indexFingerTip = landmarks[8];
  let middleFingerTip = landmarks[12];
  let ringFingerTip = landmarks[16];
  let pinkyTip = landmarks[20];

  // Vérification si le pouce est étendu et orienté vers le haut
  let thumbExtended = thumbMcp.y < thumbCmc.y && thumbTip.y < thumbIp.y;
  let thumbOrientedUp = thumbTip.y < thumbCmc.y;

  // Vérification si les autres doigts sont pliés (pas étendus)
  let otherFingersNotExtended =
    indexFingerTip.y > indexFingerMcp.y &&
    middleFingerTip.y > middleFingerMcp.y &&
    ringFingerTip.y > ringFingerMcp.y &&
    pinkyTip.y > pinkyMcp.y;

  // Pour un geste de pouce levé, le pouce doit être étendu et orienté vers le haut,
  // et les autres doigts ne doivent pas être complètement étendus
  if (thumbExtended && thumbOrientedUp && otherFingersNotExtended) {
    return true;
  }
  return false;
}

function HandDetection({ onThumbUp, setMessages }: any) {
  const [imageSrc, setImageSrc] = useState<string>("");
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultsRef = useRef<Results>();


  const capture = useCallback(() => {
    const imageSrc = webcamRef.current!.getScreenshot();
    setImageSrc(imageSrc); // Assuming you have a state variable called 'imageSrc'

    fetch("http://127.0.0.1:8000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: imageSrc }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setMessages((messages) => [...messages, data.comment]);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });

    //  runScript("gpt.py", [imageSrc])
  }, [webcamRef.current]);

  const onResults = useCallback((results: Results) => {
    resultsRef.current = results;

    const canvasCtx = canvasRef.current!.getContext("2d")!;
    drawCanvas(canvasCtx, results);
  }, []);

  const OutputData = () => {
    const results = resultsRef.current!;
    // let thumbIsUp = isThumbUp(results.multiHandLandmarks[0]);
    // console.log(thumbIsUp); // Affichera true si le pouce est en l'air, sinon false
    if (results.multiHandedness.length === 1) {
      if (results.multiHandedness[0].label === "Right") {
        var thumbIsUp = isThumbUp(results.multiHandLandmarks[0]);
        console.log(thumbIsUp);
        if (thumbIsUp) {
          capture();
          onThumbUp();
        }
      }
    } else if (results.multiHandedness.length === 2) {
      if (results.multiHandedness[1].label === "Right") {
        var thumbIsUp = isThumbUp(results.multiHandLandmarks[1]);
        console.log(thumbIsUp);
        if (thumbIsUp) {
          capture();
          onThumbUp();
        }
      }
    }
    // console.log(results);

    // console.log(results);
  };

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults(onResults);

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      const camera = new Camera(webcamRef.current.video!, {
        onFrame: async () => {
          await hands.send({ image: webcamRef.current!.video! });
        },
        width: 1280,
        height: 720,
      });
      camera.start();
    }

    const interval = setInterval(() => {
      if (resultsRef.current) {
        OutputData();
      }
    }, 2000); // 1000 millisecondes = 1 seconde

    // Nettoyage de l'effet
    return () => clearInterval(interval);
  }, [onResults, OutputData]);

  return (
    <div className={styles.container}>
      {/* 비디오 캡쳐 */}
      <Webcam
        audio={false}
        style={{ visibility: "hidden" }}
        width={1280}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ width: 1280, height: 720, facingMode: "user" }}
      />
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        width={1280}
        height={720}
      />
    </div>
  );
}

// ==============================================
// styles

const styles = {
  container: css`
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  canvas: css`
    position: absolute;
    height: 100vh;
    background-color: #fff;
  `,
  buttonContainer: css`
    position: absolute;
    top: 20px;
    left: 20px;
  `,
  button: css`
    color: #fff;
    background-color: #0082cf;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    padding: 10px 10px;
    cursor: pointer;
  `,
};

function App() {
  const [i, setI] = useState(0);
  const [messages, setMessages] = useState([
    "Hello! Welcome to Origami AI. Start the first step and make an thump up when you are ready!",
  ]);

  console.log('--->', messages);
  const videoSources = [
    "src/assets/video/vid1.mov",
    "src/assets/video/vid2.mov",
    "src/assets/video/vid3.mov",
    "src/assets/video/vid4.mov",
    "src/assets/video/vid5.mov",
    "src/assets/video/vid6.mov",
    "src/assets/video/vid7.mov",
    "src/assets/video/vid8.mov",
    "src/assets/video/vid9.mov",
    "src/assets/video/vid10.mov",
    "src/assets/video/vid11.mov",
    "src/assets/video/vid12.mov",
    "src/assets/video/vid13.mov",
    "src/assets/video/vid14.mov",
  ];
  const schemaSources = [
    "src/assets/schema/step1.png",
    "src/assets/schema/step2.png",
    "src/assets/schema/step3.png",
    "src/assets/schema/step4.png",
    "src/assets/schema/step5.png",
    "src/assets/schema/step6.png",
    "src/assets/schema/step7.png",
    "src/assets/schema/step8.png",
    "src/assets/schema/step9.png",
    "src/assets/schema/step10.png",
    "src/assets/schema/step11.png",
    "src/assets/schema/step12.png",
    "src/assets/schema/step13.png",
    "src/assets/schema/step14.png",
  ];

  const incrementIndex = useCallback(() => {
    if (i < 13) {
      console.log(i);
      setI((i) => i + 1);
    }
  }, [i]);

  return (
    <div className="app-container">
      <HandDetection onThumbUp={incrementIndex} setMessages={setMessages}/>
      {/* <Step i={i} /> */}
      <div className="step-container">
        <Video src={videoSources[i]} />
        <Schema src={schemaSources[i]} />
        <div className="chat-container">
          <div className="messages-container">
            {messages.map((message, index) => (
              <div key={index} className="message">
                <span className="message-sender">{"GPT > "}</span>
                <span className="message-text">{message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
