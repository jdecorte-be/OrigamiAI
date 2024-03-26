from openai import AzureOpenAI
from dotenv import load_dotenv
from local_to_encode64_image import local_image_to_data_url

import json
import os

load_dotenv()

api_base = os.getenv("AZURE_OPENAI_ENDPOINT")
api_key= os.getenv("AZURE_OPENAI_API_KEY")
deployment_name = 'gpt4-003'
api_version = "2024-02-01" # this might change in the future

#image_url1 = local_image_to_data_url("/Users/ernestomendozagomez/Documents/Screenshots/Photo1.png")

client = AzureOpenAI(
    api_key=api_key,  
    api_version=api_version,
    base_url=f"{api_base}/openai/deployments/{deployment_name}"
)

for i in range(1, 2):
	image = local_image_to_data_url(f"/Users/ernestomendozagomez/Hackathon_Mons/git_project/PhotosPNG/{i}.png")
	response = client.chat.completions.create(
		model=deployment_name,
		messages=[
			{ "role": "system", "content": "You are an expert in origami folding. You are helping a beginner in the field to \
			create an origami crane. There are 11 steps to complete this origami. You need to give concise answers. Be supportive and be confident." },
			{ "role": "user", "content": [  
				{ 
					"type": "text", 
					"text": "I am doing an origami crane. This is my current state. Can you describe it ?" 
				},
				{ 
					"type": "image_url",
					"image_url": {
						"url": image
					}
				}
			] }
		],
		max_tokens=2000 
	)
	with open(f"Txt_files/{i}.txt", "w") as f:
		f.write(response.choices[0].message.content)

	print("Done " + str(i))



