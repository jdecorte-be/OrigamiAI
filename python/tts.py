from gtts import gTTS

text = "Explique moi comment plier une feuille de papier en 2 pour mon origami"
language = 'fr'

tts = gTTS(text=text, lang=language, slow=False)
tts.save("test.wav")