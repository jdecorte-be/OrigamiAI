from dotenv import load_dotenv
import os

load_dotenv()

api_base = os.getenv("AZURE_OPENAI_ENDPOINT")
api_key = os.getenv("AZURE_OPENAI_API_KEY")

from langchain_openai import AzureOpenAIEmbeddings

embeddings = AzureOpenAIEmbeddings(
    azure_deployment="embedding-main",
	model="embedding-ada-002",
    openai_api_version="2023-05-15",
)#embedding-ada-002

# Uncomment the following line if you need to initialize FAISS with no AVX2 optimization
# os.environ['FAISS_NO_AVX2'] = '1'

from langchain_community.document_loaders import TextLoader
from langchain_community.document_loaders import DirectoryLoader
from langchain_community.vectorstores import FAISS

loader = DirectoryLoader('Txt_files', loader_cls=TextLoader)
documents = loader.load()

db = FAISS.from_documents(documents, embeddings)
db.save_local("faiss_index")

print("Done")