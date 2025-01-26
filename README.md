# OrigamiAI

## Overview

OrigamiAI is a project developed during a hackathon, aiming to integrate AI capabilities into web applications. The project leverages Azure's OpenAI services to process and analyze images, providing intelligent insights and functionalities.

## Project Structure

The repository is organized into the following directories:

- **python/**: Contains Python scripts for image processing and interaction with Azure's OpenAI API.
- **website/**: Includes the frontend code, primarily written in TypeScript, CSS, and HTML, to create a user-friendly web interface.

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/jdecorte-be/OrigamiAI.git
   cd OrigamiAI
   ```

2. **Configure Environment Variables**:
   - Create a `.env` file in the root directory with the following content:
     ```
     AZURE_OPENAI_API_KEY="Your_key"
     AZURE_OPENAI_ENDPOINT="Your_endpoint"
     ```
   - Replace `"Your_key"` and `"Your_endpoint"` with your actual Azure OpenAI API key and endpoint.

3. **Install Dependencies**:
   - Navigate to the `python` directory and install the required Python packages:
     ```bash
     cd python
     pip install -r requirements.txt
     ```
   - Navigate to the `website` directory and install the necessary frontend dependencies:
     ```bash
     cd ../website
     npm install
     ```

4. **Run the Application**:
   - Start the backend server:
     ```bash
     cd ../python
     python quickstart.py
     ```
   - Launch the frontend application:
     ```bash
     cd ../website
     npm start
     ```

## Usage

The `quickstart.py` script in the `python` directory includes a function named `local_image_to_data_url`. To use this function, provide the path to your image as an argument. This function processes the image and interacts with the Azure OpenAI API to analyze the content.

## Technologies Used

- **Backend**: Python
- **Frontend**: TypeScript, CSS, HTML
- **AI Services**: Azure OpenAI API

