
## Diagram
<img width="1877" height="883" alt="image" src="https://github.com/user-attachments/assets/c34190a6-8344-42ab-acd3-af72eb35efef" />

## Project Overview

This project demonstrates a complete **enterprise-grade DevOps pipeline** for a production-style **Microservices-Based eCommerce Application** deployed using Azure DevOps, Service Mesh (Istio), and multi-cluster AWS EKS architecture.

The application consists of:

- **Frontend:** React.js  
- **Microservices:** Product, Rating, User, Cart, Order, Payment  
- **Database:** AWS RDS or any cloud-hosted database (optional integration)

The pipeline incorporates **secure build practices**, static code analysis, vulnerability scanning, artifact management, containerization, and multi-region Kubernetes deployments with Istio service mesh for advanced traffic management.

## Problem Statement

The organization requires a fully automated CI/CD and DevOps platform capable of deploying multiple containerized microservices with:

- Secure builds  
- Static code analysis  
- Vulnerability scanning  
- Artifact versioning  
- Docker image management  
- Multi-region + multi-cluster deployment  
- Service mesh traffic management  
- Disaster recovery (DR) environments  
- Observability and monitoring  

The CI/CD workflow must support secure microservice builds, manifest updates, Azure DevOps multi-stage deployments, and Istio-driven service mesh routing across DR and PROD EKS clusters.

## CI/CD Pipeline Architecture

The CI/CD pipeline is implemented using Azure DevOps (YAML + Release Pipelines) and follows an enterprise-grade flow:

### Pipeline Stages:
1. **Checkout code** from GitHub  
2. **Install dependencies** for each microservice  
3. **Build steps** (Frontend build + packaging where applicable)  
4. **Code quality scanning** using SonarQube  
5. **Docker image build** per service  
6. **Image tagging** using Azure DevOps `Build.BuildId` for versioning  
7. **Trivy image vulnerability scanning**  
8. **Docker push** to Docker Hub  
9. **Update Kubernetes manifests** with the new image tag  
10. **Publish artifacts** for CD pipelines  
11. **Release pipeline deployment** to DR and PROD clusters  
12. **Istio routing setup** (Gateway, VirtualService, DestinationRule)  
13. **Verification and monitoring**

## Tech Stack

### DevOps, CI/CD & Cloud
- **Azure DevOps Pipelines** (CI + CD)
- **Docker** and **Docker Hub**
- **Terraform Cloud + Terraform CLI**
- **AWS Cloud** (EKS, VPC, EC2, ALB, IAM)

### Code Quality & Security
- **SonarQube**
- **Trivy**
- **Azure DevOps Secure Files & Variables**

### Kubernetes & Platform Tools
- **AWS EKS**
- **kubectl**
- **Helm**
- **EBS CSI Driver**
- **AWS Load Balancer Controller**

### Service Mesh & Observability
- **Istio**
- **Kiali**
- **Prometheus**
- **Grafana**

## Infrastructure Creation (Terraform)

```bash
cd infra/
terraform init
terraform validate
terraform plan
terraform apply -auto-approve
```
- **This creates VPC, subnets, route tables, NAT gateway, security groups, EKS cluster, node groups, and base networking components for both DR and PROD clusters.**
### Or Create Infra Pipeline in the Azure DevOps for automation

## Azure DevOps Infrastructure Pipeline
## Creating a Terraform Service Connection in Azure DevOps

Follow these steps to set up an AWS service connection for Terraform:

1. Navigate to **Project settings** → **Service connections**.
2. Click **New service connection**.
3. In the search box, type **Terraform** and select it.
4. Enter the following AWS details:
   - **Access Key ID**
   - **Secret Access Key**
   - **Region**
5. Assign a connection name/ID:  
   `aws-iam-connection`
6. Click **Save** to create the service connection.
## Configuring Pipeline Variables

To run Terraform with AWS in Azure DevOps, create the following pipeline variables:

1. Navigate to **Pipelines** → **Variables**.
2. Add the following variables:

   - `AWS_ACCESS_KEY_ID`  
   - `AWS_SECRET_ACCESS_KEY`  
   - `TF_TOKEN`  
   - `TF_ORG`  
   - `TF_WORKSPACE`  

3. Save the variables to make them available during pipeline execution.
## Creating the Infrastructure Pipeline

Follow these steps to create a new classic pipeline in Azure DevOps:

1. Navigate to **Pipelines** → **New pipeline**.
2. Select **Use the classic editor**.
3. Choose your repository (Azure Repos in our case).
4. Configure the pipeline settings:
   - Select the branch containing your Terraform code. (main in our case)
   - Choose the appropriate YAML/classic pipeline option. (below are step for classic pipeline)
5. Save and run the pipeline to initialize your infrastructure deployment.

### Step 1 - Configure Backend
``` bash
#!/bin/bash
cat << EOF > $HOME/.terraformrc
credentials "app.terraform.io" {
  token = "$TF_TOKEN"
}
EOF

export AWS_ACCESS_KEY_ID=$(AWS_ACCESS_KEY_ID)
export AWS_SECRET_ACCESS_KEY=$(AWS_SECRET_ACCESS_KEY)
export AWS_DEFAULT_REGION=us-east-2
```
### Step 2 - Add TF Installer
### Step 3: Terraform Init

Add a **Bash job** to your pipeline:

1. Choose **inline script** and use the following commands:
```bash
   #!/bin/bash
   echo "Initializing Terraform Cloud backend..."
   # Debugging
   echo "Organization: $TF_ORG"
   echo "Workspace: $TF_WORKSPACE"
   # Initialize Terraform with remote backend
   terraform init
 ```
2. Under **Environment variables**, add:
``` bash
TF_TOKEN_app_terraform_io = $(TF_TOKEN)
```
### Step 4: Terraform Plan

Add a **Terraform job** to your pipeline:

1. Use the previously created **AWS service connection** (`aws-iam-connection`).
2. Set the command to:
```bash
   terraform plan
```
3. In Additional command arguments, add:  
```bash
   -out=tfplan
```
4. Under **Environment variables**, add:
``` bash
TF_TOKEN_app_terraform_io = $(TF_TOKEN)
```
### Step 5: Terraform Apply

Add a **Terraform job** to your pipeline:

1. Use the previously created **AWS service connection** (`aws-iam-connection`).
2. Set the command to:
```bash
    terraform apply
```
3. In Additional command arguments, add:  
```bash
   -auto-approve tfplan
```
4. Under **Environment variables**, add:
``` bash
TF_TOKEN_app_terraform_io = $(TF_TOKEN)
```
### Step 6: Terraform Destroy (Disabled by Default)

This step should remain **disabled** unless you explicitly want to destroy resources.

Add a **Terraform job** to your pipeline:

1. Set the command to:

   ```bash
   terraform destroy
   ```
2. In Additional command arguments, add:  
```bash
   -auto-approve 
```
3. Under **Environment variables**, add:
``` bash
TF_TOKEN_app_terraform_io = $(TF_TOKEN)
```
# Micro-services CI Pipeline

We will create a CI pipeline for each micro-service.  
Below is an example pipeline for the **frontend service**.  
All other services will follow the same flow.

---

## Frontend CI Pipeline

1. Navigate to **Pipelines** → **New pipeline**.
2. Select your repository (e.g., GitHub, Azure Repos).
3. Choose **YAML pipeline**.
4. Add the following sample YAML definition:
## Step 1: Create Docker Hub Registry Service Connection

To enable container builds and pushes, create a Docker Hub service connection:

1. Navigate to **Project settings** → **Service connections**.
2. Click **New service connection**.
3. Select **Docker Registry** (choose **Others** if you are using a different registry).
4. Enter your Docker Hub credentials:
   - **Username**
   - **Password**
5. Assign a connection name (e.g., `docker-hub-connection`).
6. Click **Save** to create the service connection.

## Step 2: Set Environment Variables in Pipeline
1. DOCKER_REGISTERY
2. IMAGE_NAME
3. NODE_VERSION
## Step 3: Add Stages to the Pipeline

Define the following stages in your CI pipeline:

### Stage 1: Check out code
- Use the built-in task to check out the repository code.

### Stage 2: Install dependencies & generate artifact
- Applicable **only for frontend service**.
- Run `npm install` and `npm run build`.
- Publish the generated artifact (e.g., `dist` folder).

### Stage 3: SonarQube scan (optional)
- Integrate with SonarQube for static code analysis.
- This step can be skipped if not required.

### Stage 4: Docker build & push
- Log in to Docker Hub using the service connection (`docker-hub-connection`).
- Build the Docker image using the pipeline variable `Build.BuildID` as the tag.
- Push the image to Docker Hub.  
  > Using `Build.BuildID` ensures each build has a unique tag, making rollbacks easier.

### Stage 5: Trivy Image Scan
- Run a **Trivy scan** on the built Docker image.
- Detect vulnerabilities before deploying to Kubernetes.

### Stage 6: Update Kubernetes manifests
- Update the Kubernetes manifest files stored in the repo.
- Replace the image tag with the latest `Build.BuildID`.
- Commit and apply the updated manifests for deployment.
# Frontend CI Pipeline (YAML)
## You will find all this files in github repo, this is just for example
Below is the complete Azure DevOps pipeline YAML for the **frontend micro-service**.  
This pipeline covers checkout, build, Docker image creation, security scanning, and manifest updates.

```yaml
trigger:
  branches:
    include:
      - main
  paths:
    include:
      - frontend/*

variables:
  DOCKER_REGISTRY: 'surendraprajapati'  # Replace with your DockerHub or ACR
  IMAGE_NAME: 'frontend'
  NODE_VERSION: '18.x'

stages:

# Stage 1: Checkout
- stage: Checkout
  displayName: 'Checkout Code'
  jobs:
    - job: Checkout
      pool:
        vmImage: 'ubuntu-latest'
      steps:
        - checkout: self

# Stage 2: Node Build
- stage: NodeBuild
  displayName: 'Install Dependencies & Build'
  dependsOn: Checkout
  jobs:
    - job: NodeBuild
      pool:
        vmImage: 'ubuntu-latest'
      steps:
        - task: NodeTool@0
          inputs:
            versionSpec: '$(NODE_VERSION)'
        - script: |
            cd frontend
            npm install
            npm run build
          displayName: 'Install Node dependencies & Build React App'
        - task: PublishPipelineArtifact@1
          inputs:
            targetPath: 'frontend/build'
            artifact: 'frontend-build'
            publishLocation: 'pipeline'

# Stage 3: SonarQube Scan (optional)
# - stage: SonarQube
#   displayName: 'SonarQube Analysis'
#   dependsOn: NodeBuild
#   jobs:
#     - job: SonarScan
#       pool:
#         vmImage: 'ubuntu-latest'
#       steps:
#         - task: SonarQubePrepare@5
#           inputs:
#             SonarQube: 'MySonarServiceConnection'
#             scannerMode: 'CLI'
#             configMode: 'manual'
#             cliProjectKey: 'frontend'
#         - task: SonarQubeAnalyze@5
#         - task: SonarQubePublish@5

# Stage 4: Docker Build & Push
- stage: DockerBuild
  displayName: 'Build & Push Docker Image'
  jobs:
    - job: Docker
      pool:
        vmImage: 'ubuntu-latest'
      steps:
        - task: Docker@2
          inputs:
            containerRegistry: 'docker-connection'
            command: 'login'
        - task: Docker@2
          inputs:
            repository: '$(DOCKER_REGISTRY)/$(IMAGE_NAME)'
            command: 'build'
            Dockerfile: 'frontend/Dockerfile'
            tags: '$(Build.BuildId)'
        - task: Docker@2
          inputs:
            containerRegistry: 'docker-connection'
            repository: '$(DOCKER_REGISTRY)/$(IMAGE_NAME)'
            command: 'push'
            tags: '$(Build.BuildId)'

# Stage 5: Trivy Image Scan
- stage: TrivyScan
  displayName: 'Scan Docker Image with Trivy'
  dependsOn: DockerBuild
  jobs:
    - job: Trivy
      pool:
        vmImage: 'ubuntu-latest'
      steps:
        - script: |
            echo "Installing Trivy..."
            sudo apt-get update
            sudo apt-get install -y wget gnupg lsb-release
            wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | gpg --dearmor | sudo tee /usr/share/keyrings/trivy.gpg > /dev/null
            echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/trivy.list
            sudo apt-get update
            sudo apt-get install -y trivy
        - script: |
            echo "Running Trivy scan..."
            docker pull $(DOCKER_REGISTRY)/$(IMAGE_NAME):$(Build.BuildId)
            trivy image --format table --output frontend-image-scan.html $(DOCKER_REGISTRY)/$(IMAGE_NAME):$(Build.BuildId)
          displayName: 'Trivy Docker Image Scan'
        - task: PublishPipelineArtifact@1
          inputs:
            targetPath: 'frontend-image-scan.html'
            artifact: 'trivy-report'
            publishLocation: 'pipeline'

# Stage 6: Update Kubernetes Manifests
- stage: UpdateManifest
  displayName: 'Update Docker Image Tag in Kubernetes Manifests'
  dependsOn: TrivyScan
  variables:
    - group: ado-token   # brings in AZURE_DEVOPS_PAT securely
  jobs:
    - job: UpdateManifest
      pool:
        vmImage: 'ubuntu-latest'
      steps:
        - checkout: self
        - script: |
            echo "Updating manifest via script..."
            cd "$(Build.SourcesDirectory)"
            ls -al update-manifest.sh
            SERVICE_NAME="frontend"
            REGISTRY="$(DOCKER_REGISTRY)"
            NEW_TAG="$(Build.BuildId)"
            bash update-manifest.sh "$SERVICE_NAME" "$REGISTRY" "$NEW_TAG"
          displayName: 'Run manifest update script'
          env:
            AZURE_DEVOPS_PAT: $(AZURE_DEVOPS_PAT)
        - task: PublishPipelineArtifact@1
          displayName: 'Publish updated Kubernetes manifests'
          inputs:
            targetPath: '$(Build.SourcesDirectory)/k8s/frontend-deployment.yaml'
            artifact: 'frontend-manifest'
            publishLocation: 'pipeline'
```
# Verification

 All pipeline stages executed successfully:  
- **Checkout** completed  
- **Dependencies installed & artifact generated** (frontend only)  
- **SonarQube scan** (optional)  
- **Docker image built & pushed** with unique `Build.BuildId` tag  
- **Trivy image scan** completed and report published  
- **Kubernetes manifests updated** with the latest image tag  

Artifacts were saved and the Docker image was updated and pushed to Docker Hub.

---

# Pipelines for Other Micro‑services

Each micro‑service should follow the same CI pipeline flow as the frontend service, with minor adjustments:

1. **Stage 1: Checkout**  
   - Same for all services.

2. **Stage 2: Build & Artifact**  
   - Only applicable for services that require a build step (e.g., frontend React build).  
   - Skip for backend services that don’t produce build artifacts.

3. **Stage 3: SonarQube Scan (optional)**  
   - Can be enabled for code quality checks across all services.

4. **Stage 4: Docker Build & Push**  
   - Update `IMAGE_NAME` variable for each service 
   - Use the same registry connection (`docker-hub-connection`).  
   - Each service gets its own unique Docker image tag via `Build.BuildId`.

5. **Stage 5: Trivy Image Scan**  
   - Run Trivy against each service’s Docker image.

6. **Stage 6: Update Kubernetes Manifests**  
   - Update the corresponding Kubernetes deployment YAML for each service with the new image tag.  
   - Example: `k8s/backend-deployment.yaml`, `k8s/auth-deployment.yaml`.

---

# Example Variables per Service

| Service   | IMAGE_NAME | Build Step Required |
|-----------|------------|---------------------|
| Frontend  | frontend   |    Yes (npm build)  |
| Backend   | backend    |    No               |
| Auth      | auth       |    No               |
| API       | api        |    No               |
| Database  | database   |    No               |

---

# Continuous Deployment (CD) Pipeline

To deploy micro-services into different environments, configure a release pipeline with two stages: **DR** and **PROD**.

---

## Steps to Create CD Pipeline

1. Navigate to **Release pipelines** → **New pipeline**.
2. Add your **repository** as the artifact source for the release pipeline.
3. Create two stages:
   - **DR** (Disaster Recovery / lower environment)
   - **PROD** (Production environment)

---

## Variable Groups

1. Go to **Library** → **Variable groups**.
2. Create two variable groups:
   - `DR-vars` → contains environment-specific variables for DR stage.
   - `PROD-vars` → contains environment-specific variables for PROD stage.

---

## Linking Variable Groups

- Link **DR-vars** to the **DR stage** in the release pipeline.
- Link **PROD-vars** to the **PROD stage** in the release pipeline.

---

## Flow Summary

- **Artifact Source**: Repository (contains manifests, and deployment scripts).
- **Stage 1 (DR)**: Deploy using variables from `DR-vars`.
- **Stage 2 (PROD)**: Deploy using variables from `PROD-vars`.

This ensures environment‑specific configurations are applied automatically during deployments.

# DR CD Pipeline and Cluster Setup

## Cluster Setup

To securely deploy and access the Kubernetes cluster, follow these steps:

### Step 1: Install AWS CLI
If the AWS CLI is not installed, run the following commands:
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

### Step 2: Configure AWS CLI
Configure your AWS credentials:
``` bash
aws configure
```
Provide:
- AWS Access Key ID
- AWS Secret Access Key
- Default region name
- Output format (optional)

### Step 3: Install kubectl
Install kubectl to interact with your Kubernetes cluster:
``` bash
curl -o kubectl https://amazon-eks.s3.us-west-2.amazonaws.com/1.29.0/2023-11-14/bin/linux/amd64/kubectl
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin
kubectl version --client
```
### Step 4: Install eksctl
Install eksctl to manage EKS clusters:
``` bash
curl --silent --location "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin
eksctl version
```
# DR EKS Cluster Setup

To connect your local environment or CI/CD pipeline to the **DR EKS Cluster**, update the kubeconfig:

```bash
aws eks update-kubeconfig --name dr-eks-cluster --region us-east-2
```
## Verify Cluster Connectivity

After updating your kubeconfig for the **DR EKS Cluster**, check if you can connect to the cluster:

```bash
kubectl get nodes
```
## Create Namespace for DR Environment

To isolate resources for the **DR environment**, create a dedicated Kubernetes namespace.

### Step 1: Create Namespace
Run the following command:

```bash
kubectl create ns ecommerce-dr
```
### Step 2: Verify Namespace
Check if the namespace was created successfully:
``` bash
kubectl get ns
```
## Create Service Account for DR Cluster

To enable secure deployments in the **DR EKS Cluster**, create a Kubernetes Service Account.

### Step 1: Navigate to the Repo
Go to your repository path:
``` bash
cd ./k8s/RBAC/dr-sa/serviceaccount.yaml
```
### Step 2: Apply the Service Account
Run the following command to apply the manifest:
``` bash
kubectl apply -f repo/k8s/RBAC/dr-sa/serviceaccount.yaml
```
### step 3: Create Secret for Service Account

To securely associate a token with the service account in the **ecommerce-dr** namespace:

###  Apply the Secret Manifest
Run the following command to create the secret from your YAML file:

```bash
kubectl apply -f sa-secret-token.yaml
```
# Get Cluster URL and Secret for Azure DevOps Service Connection

To configure the Kubernetes service connection in Azure DevOps, you need the **Cluster URL** and the **Service Account Secret token**.

---

## Step 1: Get Cluster URL
Run the following command to retrieve the cluster API server URL:

```bash
kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}'
```
## step 2: Get Secret for Azure DevOps Service Connection

 **Important:** Secrets are sensitive. Do not share or commit them to source control.  
Use them only within Azure DevOps service connections.

###  Retrieve the Secret in JSON Format
Run the following command to get the secret associated with the DR service account:
``` bash
kubectl get secret dr-sa-token -n ecommerce-dr -o json
```
# Configure Kubernetes Service Connection in Azure DevOps

To allow Azure DevOps pipelines to deploy to your EKS cluster, create a Kubernetes service connection.

---

## Steps

1. Go to **Azure DevOps (ADO)** → **Project Settings** → **Service connections**.
2. Click **New service connection** → choose **Kubernetes**.
3. Select **Service account** authentication.
4. Enter the following details:
   - **Cluster URL** → retrieved earlier using:
     ```bash
     kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}'
     ```
   - **Service Account Token (Secret)** → retrieved from:
     ```bash
     kubectl get secret dr-sa-token -n ecommerce-dr -o json
     ```
     
5. Provide a **Service connection name** (e.g., `dr-eks-connection`).
6. Save the connection.

---

## Notes
- Do **not** share or commit the secret token; use it only in Azure DevOps.
- The service connection name will be referenced in your pipeline YAML for Kubernetes deployment tasks.
# Istio Setup

Istio is a **service mesh** that provides:
- **Traffic management** between microservices
- **Secure communication** with mTLS (mutual TLS)
- **Observability** with tools like **Kiali**, **Grafana**, and **Prometheus**
- Works across Kubernetes clusters or distributed systems

---

## Step 1: Install Istioctl
Download and install the Istio CLI (`istioctl`):

```bash
curl -L https://istio.io/downloadIstio | sh -
cd istio-1.28.0
export PATH=$PWD/bin:$PATH
```
## Step 2: Install Istio in DR EKS Cluster

Once `istioctl` is installed and your kubeconfig is pointing to the **DR EKS Cluster**, run the following command to deploy Istio:

```bash
istioctl install --set profile=demo -y
```
## Step 3: Enable Istio Sidecar Injection

To allow Istio to automatically inject Envoy sidecars into pods in the **ecommerce-dr** namespace:

###  Label the Namespace
Run the following command:

```bash
kubectl label namespace ecommerce-dr istio-injection=enabled
```
### step 4: Confirm by running command
``` bash
Kubectl get all -n istio-system
```

# PROD CD Pipeline and Cluster Setup

#  PROD-EKS Cluster Setup

To connect your local environment or CI/CD pipeline to the **Prod EKS Cluster**, update the kubeconfig:

```bash
aws eks update-kubeconfig --name prod-eks-cluster --region us-east-1
```
## Verify Cluster Connectivity

After updating your kubeconfig for the **Prod EKS Cluster**, check if you can connect to the cluster:

```bash
kubectl get nodes
```
## Create Namespace for PROD Environment

To isolate resources for the **PROD  environment**, create a dedicated Kubernetes namespace.

### Step 1: Create Namespace
Run the following command:

```bash
kubectl create ns ecommerce-prod
```
### Step 2: Verify Namespace
Check if the namespace was created successfully:
``` bash
kubectl get ns
```
## Create Service Account for PROD  Cluster

To enable secure deployments in the **PROD  EKS Cluster**, create a Kubernetes Service Account.

### Step 1: Navigate to the Repo
Go to your repository path:
``` bash
cd ./k8s/RBAC/prod-sa/serviceaccount.yaml
```
### Step 2: Apply the Service Account
Run the following command to apply the manifest:
``` bash
kubectl apply -f repo/k8s/RBAC/prod-sa/serviceaccount.yaml
```
### step 3: Create Secret for Service Account

To securely associate a token with the service account in the **ecommerce-prod** namespace:

###  Apply the Secret Manifest
Run the following command to create the secret from your YAML file:

```bash
kubectl apply -f sa-secret-token.yaml
```
# Get Cluster URL and Secret for Azure DevOps Service Connection

To configure the Kubernetes service connection in Azure DevOps, you need the **Cluster URL** and the **Service Account Secret token**.

---

## Step 1: Get Cluster URL
Run the following command to retrieve the cluster API server URL:

```bash
kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}'
```
## step 2: Get Secret for Azure DevOps Service Connection

 **Important:** Secrets are sensitive. Do not share or commit them to source control.  
Use them only within Azure DevOps service connections.

###  Retrieve the Secret in JSON Format
Run the following command to get the secret associated with the PROD  service account:
``` bash
kubectl get secret prod-sa-token -n ecommerce-prod -o json
```
# Configure Kubernetes Service Connection in Azure DevOps

To allow Azure DevOps pipelines to deploy to your EKS cluster, create a Kubernetes service connection.

---

## Steps

1. Go to **Azure DevOps (ADO)** → **Project Settings** → **Service connections**.
2. Click **New service connection** → choose **Kubernetes**.
3. Select **Service account** authentication.
4. Enter the following details:
   - **Cluster URL** → retrieved earlier using:
     ```bash
     kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}'
     ```
   - **Service Account Token (Secret)** → retrieved from:
     ```bash
     kubectl get secret prod-sa-token -n ecommerce-prod -o json
     ```
     
5. Provide a **Service connection name** (e.g., `prod-eks-connection`).
6. Save the connection.

---

## Notes
- Do **not** share or commit the secret token; use it only in Azure DevOps.
- The service connection name will be referenced in your pipeline YAML for Kubernetes deployment tasks.
# Istio Setup

Istio is a **service mesh** that provides:
- **Traffic management** between microservices
- **Secure communication** with mTLS (mutual TLS)
- **Observability** with tools like **Kiali**, **Grafana**, and **Prometheus**
- Works across Kubernetes clusters or distributed systems

---

## Step 1: Install Istioctl
Download and install the Istio CLI (`istioctl`):

```bash
curl -L https://istio.io/downloadIstio | sh -
cd istio-1.28.0
export PATH=$PWD/bin:$PATH
```
## Step 2: Install Istio in PROD EKS Cluster

Once `istioctl` is installed and your kubeconfig is pointing to the **DR EKS Cluster**, run the following command to deploy Istio:

```bash
istioctl install --set profile=demo -y
```
## Step 3: Enable Istio Sidecar Injection

To allow Istio to automatically inject Envoy sidecars into pods in the **ecommerce-prod** namespace:

###  Label the Namespace
Run the following command:

```bash
kubectl label namespace ecommerce-prod istio-injection=enabled
```
### step 4: Confirm by running command
``` bash
Kubectl get all -n istio-system
```
# Azure DevOps Release Pipeline for DR and PROD EKS Clusters

This release pipeline automates deployment of Kubernetes services and Istio manifests to both **DR** and **PROD** clusters.

---

## Pipeline Tasks

### Task 1: Install Kubectl
Add a task to install `kubectl` in the agent:
### Task 2: Login to Service Account
Use the previously created service connection (dr-eks-connection or prod-eks-connection) to authenticate:
### Task 3: Replace Variables in Service Manifests
Install the Replace Tokens extension from the Azure DevOps Marketplace. Add a task to replace variables (e.g., VERSION, SERVICE_ACCOUNT) in Kubernetes service manifests:
### Task 4: Replace Variables in Istio Manifests
Similarly, replace variables in Istio manifests:
### Task 5: Apply Service Manifests
Deploy the service manifests to the appropriate namespace:
### Task 6: Apply Istio Manifests
Deploy Istio manifests to the namespace:

## Deployment Process
Create a new release in Azure DevOps.

### Pipeline stages:

dr-stage → deploys to **ecommerce-dr** namespace in DR cluster.

prod-stage → deploys to **ecommerce-prod** namespace in PROD cluster.

Manual approval required before deploying to each stage.

Once approved, manifests are applied to the respective clusters.
## Varify
```bash
Kubectl get all -n ecommerce-dr
```
```bash
Kubectl get all -n ecommerce-dr
```
# Get Istio Ingress Load Balancer URL

To access applications exposed through Istio, you need the **Load Balancer URL** attached to the Istio Ingress Gateway.

---

## Step 1: List Istio Services
Run the following command to list all services in the `istio-system` 
```bash
kubectl get svc -n istio-system
```

# Istio Monitoring Setup

Istio provides in-built monitoring and observability dashboards such as:
- **Kiali** → Service mesh visualization and traffic management
- **Grafana** → Metrics dashboards
- **Prometheus** → Metrics collection and storage

---

## Step 1: Install Addons
Make sure you are in the Istio installation 
```bash
cd istio-1.28.0
kubectl apply -f samples/addons
kubectl get pods -n istio-system
```
## Step 2: Access Dashboards via Port-Forward
You can access the dashboards locally by port-forwarding the services:
```bash
# Grafana
kubectl -n istio-system port-forward svc/grafana 3000:3000

# Kiali
kubectl -n istio-system port-forward svc/kiali 20001:20001

# Prometheus
kubectl -n istio-system port-forward svc/prometheus 9090:9090
```
## Step 3: (Optional) Expose via LoadBalancer
```bash
kubectl edit svc grafana -n istio-system
kubectl edit svc kiali -n istio-system
kubectl edit svc prometheus -n istio-system
kubectl get svc -n istio-system
```
# Cluster-Level Monitoring with Prometheus and Grafana

Prometheus and Grafana can be installed at the cluster level to provide monitoring and visualization across all namespaces in your EKS cluster.

---

## Step 1: Add Helm Repositories
Add the official Helm chart repositories for Prometheus and Grafana:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
# crete namespace
kubectl create namespace monitoring
# install Prometheus and Grafana using HELM
helm install prometheus prometheus-community/kube-prometheus-stack \
--namespace monitoring \
--set grafana.service.type=LoadBalancer \
--set prometheus.service.type=LoadBalancer
# varify installation
kubectl get pods -n monitoring
kubectl get svc -n monitoring
```
## step 2: Get Grafana Admin Password

After installing Grafana via the `kube-prometheus-stack` Helm chart, the admin password is stored in a Kubernetes secret.

Run the following command to retrieve and decode it:

```bash
kubectl --namespace monitoring get secret prometheus-grafana \
-o jsonpath="{.data.admin-password}" | base64 -d ; echo
```
Import Dashboards from Grafana marketplace and monitor your cluster activity.

## Set Up your prod-Cluster same way create separate prod stage in the release, deploy application to prod, enable Istio monitoring and Install Grafana and Prometheus using Helm for cluster monitoring.That way you will have your application deployed on both dr-eks-cluster and prod-eks-cluster.

# Clean Up Environment After Project

Once the project is complete, you can remove all namespaces and resources created for monitoring, Istio, and the DR application.

---

## Step 1: Delete Monitoring, ISTIO and Application Namespaces
This removes Prometheus, Grafana, and related monitoring components, Istio componenets and LOad balancer, Application Components:

```bash
kubectl delete ns monitoring
kubectl delete ns istio-system
kubectl delete ns ecommerce-dr
```
# Destroy Cloud Resources via Azure DevOps Infra Pipeline

When the project is complete, you can safely remove all cloud resources provisioned by Terraform by enabling the **destroy step** in your Infra pipeline.

---

## Step 2: Delete Infra 

1. **Navigate to Infra Pipeline**
   - Go to your Azure DevOps project.
   - Open **Pipelines → Infra pipeline**.

2. **Enable Destroy Step**
   - Edit the pipeline definition.
   - Disable terraform plan and terraform apply stage
   - enable terraform destroy stage

**run the pipeline and it will delete all the infra**

# Future Scope: Active-Active Traffic Management with AWS Route 53

In the current setup, both **DR** and **PROD** clusters are active and capable of serving the application.  
As a future enhancement, we can configure **AWS Route 53** to manage traffic between these clusters.

---

## Goals
- Maintain **active-active** architecture: both DR and PROD clusters continue serving traffic.
- Use **Route 53 DNS records** to direct client requests to either cluster.
- Enable **traffic switching** from PROD to DR in case of failures or maintenance.

---

## Approach
1. **Create Route 53 Hosted Zone** for your application domain (e.g., `example.com`).
2. **Add DNS records** pointing to the Load Balancer URLs of:
   - Istio Ingress Gateway in **PROD**
   - Istio Ingress Gateway in **DR**
3. Configure **health checks** in Route 53 to monitor cluster availability.
4. Use **weighted routing** or **failover routing**:
   - **Weighted routing** → distribute traffic between PROD and DR (active-active).
   - **Failover routing** → automatically switch traffic to DR if PROD becomes unhealthy.

---

## Benefits
- Seamless failover between PROD and DR clusters.
- High availability and resilience for critical applications.
- Flexibility to balance traffic or perform controlled cutovers.

---

 With Route 53 configured, your DR and PROD clusters will both serve traffic, and you’ll have the ability to switch traffic between them as needed.
# Closing Thoughts

This project demonstrates how to build a resilient, observable, and secure application platform across **DR** and **PROD** EKS clusters with Istio service mesh and integrated monitoring.  

By combining Kubernetes, Istio, Azure DevOps, and Helm‑based monitoring, I’ve created an environment that is:
- **Scalable** → ready to handle growth and new workloads
- **Resilient** → capable of failover and active‑active traffic management
- **Observable** → with full visibility into services, traffic, and performance
- **Automated** → using pipelines for consistent deployments and infrastructure lifecycle management

---

> Great infrastructure isn’t just about uptime — it’s about confidence.  
> With this setup, you can deploy, monitor, and scale applications knowing your clusters are prepared for both today’s needs and tomorrow’s challenges.

---




