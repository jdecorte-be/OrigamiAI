import speech_recognition as sr

google_cloud_key_path = "metal-vehicle-252519-12acd75b959f.json"

def listen_for_trigger_word(triggers): #⁠type: ignore
	recognizer = sr.Recognizer()
	with sr.Microphone() as source:
		recognizer.adjust_for_ambient_noise(source, duration=1)

		try:
			audio = recognizer.listen(source, timeout=1)
			text = recognizer.recognize_google_cloud(audio, credentials_json=google_cloud_key_path, language="fr-FR")

			for trigger in triggers:
				if trigger.lower() in text.lower():
					return True
		except :
			return False

triggers = ["tracteur"]
print("listenihn")
while True:
	if listen_for_trigger_word(triggers):
		print("Trigger word detected!")
		break
print("done listening")