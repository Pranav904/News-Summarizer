Create a lambda layer , prefereably on a Linux AMI machine (i.e, Ec2) , follow these steps:

1. Set up the working directory:
        mkdir lambda-layer
        cd lambda-layer

2. Create a Python virtual environment:
        python3 -m venv venv
        source venv/bin/activate  # On Windows, use `venv\Scripts\activate`

3. Create a requirements.txt file with all your dependencies:
        echo "requests boto3 google-generativeai" > requirements.txt

4. Install the dependencies:
        pip install -r requirements.txt

5. Create the layer structure:
        mkdir -p python/lib/python3.8/site-packages

6. Copy the installed packages to the layer directory: (Do change the python runtime based on the version you have used to create the layer)
        cp -r venv/lib/python3.8/site-packages/* python/lib/python3.8/site-packages/

7. Create the layer ZIP file:
        zip -r lambda-layer.zip python


Now you have a lambda-layer.zip file containing all your dependencies. Next, let's upload this as a Lambda Layer:

Open the AWS Lambda console in your web browser.
In the left navigation pane, click on "Layers".
Click the "Create layer" button.