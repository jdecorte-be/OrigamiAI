from openai import AzureOpenAI
# from local_to_encode64_image import local_image_to_data_url

import json
import os

def get_comment(image_input):
	# load_dotenv()

	api_base = "https://aoai-techvswild-swedencentral-hackathon-001.openai.azure.com/"
	api_key= "e682918fcbf644bb86565f02a2ab7adb"
	deployment_name = 'gpt4-003'
	api_version = "2024-02-01" # this might change in the future

	#image_url1 = local_image_to_data_url("/Users/ernestomendozagomez/Documents/Screenshots/Photo1.png")

	client = AzureOpenAI(
		api_key=api_key,  
		api_version=api_version,
		base_url=f"{api_base}/openai/deployments/{deployment_name}"
	)

	def get_prompt(image_input):
		# image_input = local_image_to_data_url(path_to_image)
		# image_good = local_image_to_data_url("/Users/ernestomendozagomez/Hackathon_Mons/git_project/PhotosPNG/20.png")
		# image_wrong = local_image_to_data_url("/Users/ernestomendozagomez/Hackathon_Mons/git_project/PhotosPNG/Bad1.png")
		response = client.chat.completions.create(
			model=deployment_name,
			messages=[
				{ "role": "system", "content": "You are an expert in origami folding. You are helping a beginner in the field to \
				create an origami crane. There are 12 steps to complete this origami. You will tell him if the foldings he is doing are correct. You need to give concise answers following this pattern : \
				the first sentence will be 'Up.' if it is correct, 'Down.' if it is incorrect. Explain why. Be short and concise. Be confident in your answers.\
				" },
				{ "role": "user", "content": [  
					{ 
						"type": "text", 
						"text": "I am doing an origami crane. This is my current state. Is it correct ?" 
					},
					{ 
						"type": "image_url",
						"image_url": {
							"url": image_input
						}
					}
				] }
			],
			max_tokens=2000 
		)
		return response.choices[0].message.content

	#-----Embeding-----
	from langchain_openai import AzureOpenAIEmbeddings

	embeddings = AzureOpenAIEmbeddings(
		azure_deployment="embedding-main",
		model="embedding-ada-002",
		openai_api_version="2023-05-15",
	)#embedding-ada-002

	from langchain_community.vectorstores import FAISS
	db = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)

	query = get_prompt(image_input)
	docs = db.similarity_search(query)

	#docs[0].page_content
	#return_answer("/Users/ernestomendozagomez/Hackathon_Mons/git_project/PhotosPNG/Bad3.png")
	return(docs[0].page_content)